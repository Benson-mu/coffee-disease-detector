import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
from tensorflow.keras.optimizers import Adam
import os

# --- Configuration ---
IMG_SIZE = 160  # Input image size for MobileNetV2
BATCH_SIZE = 16 
EPOCHS = 30 
# Updated DATA_DIR for the coffee dataset structure
DATA_DIR = '../Cofee disease dataset/train' 
# Updated MODEL_PATH for the new coffee model
MODEL_PATH = 'best_coffee_disease_model.h5' 

# Check if the data directory exists
if not os.path.exists(DATA_DIR):
    print(f"Error: Data directory not found at {DATA_DIR}")
    print("Please check your path and make sure your 'Cofee disease dataset/train' folder is correctly located.")
    exit()

# 1. Data Augmentation and Loading
# This generator applies subtle random transformations to make the model more robust.
train_datagen = ImageDataGenerator(
    rescale=1./255, # Normalize pixel values
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

# Load the training data, inferring class names from subdirectories
# This will find the 7 subfolders: Cerscospora, coffee___healthy, etc.
train_generator = train_datagen.flow_from_directory(
    DATA_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=True
)

NUM_CLASSES = train_generator.num_classes
CLASS_NAMES = list(train_generator.class_indices.keys())
print(f"Found {NUM_CLASSES} classes for coffee disease detection: {CLASS_NAMES}")

# 2. Transfer Learning using MobileNetV2
# Load the pre-trained MobileNetV2 base model (excluding the top classification layer)
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(IMG_SIZE, IMG_SIZE, 3), # Input shape 160x160
    include_top=False,
    weights='imagenet'
)

# Freeze the weights of the base model so they aren't changed during initial training
base_model.trainable = False

# 3. Build the new classification head
model = Sequential([
    base_model,
    GlobalAveragePooling2D(), # Reduces feature map size for input to Dense layers
    Dense(512, activation='relu'),
    Dropout(0.5), # Regularization to prevent overfitting
    Dense(NUM_CLASSES, activation='softmax') # Output layer, configured for 7 classes
])

# 4. Compile the model
# Use a custom, lower learning rate for fine-tuning the pre-trained weights
model.compile(
    optimizer=Adam(learning_rate=0.0001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# 5. Define Callbacks
# ModelCheckpoint saves the best model based on training loss
checkpoint = ModelCheckpoint(
    MODEL_PATH,
    monitor='loss', 
    save_best_only=True,
    mode='min',
    verbose=1
)

# EarlyStopping prevents overfitting by stopping training if loss doesn't improve
early_stopping = EarlyStopping(
    monitor='loss',
    patience=5, 
    mode='min',
    restore_best_weights=True,
    verbose=1
)

callbacks_list = [checkpoint, early_stopping]

# 6. Train the model
print("Starting coffee disease model training...")
history = model.fit(
    train_generator,
    epochs=EPOCHS,
    callbacks=callbacks_list
)

print(f"\nTraining complete. Best coffee disease model saved to {MODEL_PATH}")

# Optional: Unfreeze and fine-tune for better results if time allows
# base_model.trainable = True
# model.compile(...)
# model.fit(...)