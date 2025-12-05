// src/components/ui/InputField.tsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField: React.FC<{
  icon: React.ElementType;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ icon: Icon, placeholder, type, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const isPasswordField = type === 'password';
  const VisibilityIcon = showPassword ? EyeOff : Eye;

  return (
    <div className="relative mb-4">
      {/* Left Icon */}
      <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

      {/* Input */}
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-12 pr-12 py-3 border border-gray-700 rounded-xl bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-inner"
      />

      {/* Password Visibility Toggle */}
      {isPasswordField && (
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <VisibilityIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default InputField;
