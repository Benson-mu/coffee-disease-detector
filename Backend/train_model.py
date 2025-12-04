import os
# --- CRITICAL FIX: Set the Keras backend to TensorFlow before importing TF or Keras ---
os.environ["KERAS_BACKEND"] = "tensorflow"

import tensorflow as tf
import matplotlib.pyplot as plt
# We still need MobileNetV2 and its specific preprocessing function
from keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from keras.layers import Dense, GlobalAveragePooling2D, Dropout
from keras.models import Model, Sequential
from keras.optimizers import Adam
# Removed: from tensorflow.keras.preprocessing.image import ImageDataGenerator
from keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau

# --- Configuration Constants ---
IMG_SIZE = (224, 224) # MobileNetV2 expects 224x224 input
BATCH_SIZE = 32
# Ensure this path is correct relative to the 'Backend' folder
DATA_DIR = '../Coffee disease dataset/train' 
NUM_CLASSES = 7 
FINE_TUNE_LAYERS = 50 # Unfreeze the last 50 layers for fine-tuning
MODEL_SAVE_PATH = 'best_coffee_disease_model.keras'
AUTOTUNE = tf.data.AUTOTUNE # Optimization constant

# --- Helper function for Data Augmentation (using tf.keras layers) ---
def get_augmenter():
    """
    Creates a Sequential model for on-the-fly data augmentation.
    """
    return Sequential([
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.2),
        tf.keras.layers.RandomZoom(0.2),
        tf.keras.layers.RandomTranslation(height_factor=0.2, width_factor=0.2),
        tf.keras.layers.RandomContrast(0.2),
    ], name="data_augmenter")

# --- Helper function for Preprocessing and Optimization ---
def prepare_dataset(ds, is_training=False):
    """
    Applies MobileNetV2 preprocessing and optimization steps (caching/prefetching).
    """
    # Create the augmentation model
    augmenter = get_augmenter()

    def apply_preprocessing(image, label):
        # Apply MobileNetV2 specific preprocessing
        # Note: Datasets yield integer labels, so we convert them to one-hot encoding here
        image = preprocess_input(image)
        label = tf.one_hot(label, depth=NUM_CLASSES)
        return image, label

    # Apply preprocessing (rescaling, one-hot encoding) to all datasets
    ds = ds.map(apply_preprocessing, num_parallel_calls=AUTOTUNE)

    if is_training:
        # Apply augmentation only to the training set
        def apply_augmentation(image, label):
            image = augmenter(image, training=True)
            return image, label
        ds = ds.map(apply_augmentation, num_parallel_calls=AUTOTUNE)
        
    # Cache and prefetch for performance
    return ds.cache().prefetch(buffer_size=AUTOTUNE)

# --- 1. Data Loading (Using tf.keras.utils.image_dataset_from_directory) ---
def load_and_augment_data():
    """
    Loads data using the modern tf.data API and applies augmentation.
    """
    print("Loading data and setting up tf.data.Datasets...")

    # Load Training Dataset (80%)
    train_ds = tf.keras.utils.image_dataset_from_directory(
        DATA_DIR,
        labels='inferred',
        label_mode='int', # Use integer labels first, convert to one-hot later
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        subset='training',
        validation_split=0.2, # Use 20% for validation
        seed=123
    )
    
    # Load Validation Dataset (20%)
    validation_ds = tf.keras.utils.image_dataset_from_directory(
        DATA_DIR,
        labels='inferred',
        label_mode='int', 
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        subset='validation',
        validation_split=0.2, 
        seed=123
    )

    # --- FIX: Capture class_names before the dataset is processed and loses the attribute ---
    class_names = train_ds.class_names 
    print(f"Detected classes: {class_names}")

    # Apply preprocessing, one-hot conversion, augmentation, caching, and prefetching
    train_generator = prepare_dataset(train_ds, is_training=True)
    validation_generator = prepare_dataset(validation_ds, is_training=False)
    
    # Return the processed datasets and the class names list
    return train_generator, validation_generator, class_names

# --- 2. Model Definition ---
def build_transfer_model(num_classes):
    """
    Builds the MobileNetV2 base model and adds a custom classification head.
    """
    # Load MobileNetV2, pre-trained on ImageNet, without the top classification layer
    base_model = MobileNetV2(
        weights='imagenet', 
        include_top=False, 
        input_shape=IMG_SIZE + (3,) # Adds the 3 color channels
    )

    # --- Add the custom classification head ---
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dropout(0.5)(x) # Add Dropout to further prevent overfitting
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x) # Second Dropout layer
    predictions = Dense(num_classes, activation='softmax')(x) # Output layer

    # Final model combining base and new head
    model = Model(inputs=base_model.input, outputs=predictions)
    
    return model, base_model

# --- 3. Training Function ---
def train_model():
    """
    Implements the two-stage training process (Feature Extraction and Fine-Tuning).
    """
    # --- FIX: Unpack the class_names list returned by load_and_augment_data ---
    train_ds, validation_ds, class_names_list = load_and_augment_data()
    
    global NUM_CLASSES
    # Infer number of classes from the captured class names list
    NUM_CLASSES = len(class_names_list) 

    model, base_model = build_transfer_model(NUM_CLASSES)

    # --- Phase 1: Feature Extraction (Training only the top layers) ---
    print("\n--- PHASE 1: FEATURE EXTRACTION (Training Top Layers) ---")
    
    # Freeze the base model layers
    for layer in base_model.layers:
        layer.trainable = False

    # Compile the model with a moderate learning rate
    base_learning_rate = 1e-3 # 0.001
    model.compile(
        optimizer=Adam(learning_rate=base_learning_rate),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print(model.summary())
    
    # Define Callbacks
    callbacks = [
        EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True),
        ModelCheckpoint(MODEL_SAVE_PATH, monitor='val_accuracy', save_best_only=True, mode='max'),
    ]

    initial_epochs = 10
    
    # Use the tf.data.Dataset objects for training
    history_feature_extraction = model.fit(
        train_ds,
        epochs=initial_epochs,
        validation_data=validation_ds,
        callbacks=callbacks
    )

    # --- Phase 2: Fine-Tuning (Unfreezing top layers of base model) ---
    print("\n--- PHASE 2: FINE-TUNING (Unfreezing Top Layers of MobileNetV2) ---")

    # Unfreeze the base model
    base_model.trainable = True

    # Freeze all layers up to a specific point (e.g., last 50 layers)
    for layer in base_model.layers[:-FINE_TUNE_LAYERS]:
        layer.trainable = False

    # Ensure the frozen layers are actually non-trainable
    for layer in base_model.layers:
        if layer.name.startswith('block') and layer.trainable:
            print(f"Layer {layer.name} is now trainable for fine-tuning.")


    # Compile the model again with a very low learning rate
    fine_tune_learning_rate = 1e-5 # 0.00001 - 100x smaller than the initial rate
    model.compile(
        optimizer=Adam(learning_rate=fine_tune_learning_rate),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Add a learning rate scheduler for fine-tuning
    callbacks_fine_tune = callbacks + [
        ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=5, min_lr=1e-7)
    ]

    fine_tune_epochs = 20
    total_epochs = initial_epochs + fine_tune_epochs

    history_fine_tune = model.fit(
        train_ds,
        epochs=total_epochs,
        initial_epoch=history_feature_extraction.epoch[-1],
        validation_data=validation_ds,
        callbacks=callbacks_fine_tune
    )

    print(f"\nTraining complete. The best model weights are saved to {MODEL_SAVE_PATH}")
    
    # Function to plot results (optional but highly recommended)
    plot_history(history_feature_extraction, history_fine_tune, total_epochs)


def plot_history(history_1, history_2, total_epochs):
    """Plots training and validation metrics for both phases."""
    # Ensure history objects are lists of metrics
    acc = history_1.history['accuracy'] + history_2.history['accuracy']
    val_acc = history_1.history['val_accuracy'] + history_2.history['val_accuracy']

    loss = history_1.history['loss'] + history_2.history['loss']
    val_loss = history_1.history['val_loss'] + history_2.history['val_loss']

    plt.figure(figsize=(10, 8))
    plt.subplot(2, 1, 1)
    plt.plot(acc, label='Training Accuracy')
    plt.plot(val_acc, label='Validation Accuracy')
    plt.ylim([0.0, 1.0])
    plt.plot([len(history_1.epoch)-1, len(history_1.epoch)-1],
             plt.ylim(), label='Start Fine-Tuning', linestyle='--')
    plt.legend(loc='lower right')
    plt.title('Training and Validation Accuracy')

    plt.subplot(2, 1, 2)
    plt.plot(loss, label='Training Loss')
    plt.plot(val_loss, label='Validation Loss')
    plt.plot([len(history_1.epoch)-1, len(history_1.epoch)-1],
             plt.ylim(), label='Start Fine-Tuning', linestyle='--')
    plt.legend(loc='upper right')
    plt.title('Training and Validation Loss')
    plt.xlabel('epoch')
    plt.show()

if __name__ == '__main__':
    # Setting up the environment check
    if not os.path.isdir(DATA_DIR):
        print("ERROR: DATA_DIR not found. Please ensure your dataset folder is structured correctly:")
        print("The folder 'Coffee disease dataset' must be one level above the 'Backend' folder.")
        print(f"Expected path: {DATA_DIR}")
    else:
        train_model()