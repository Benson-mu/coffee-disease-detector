import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { AlertMessageProps } from '../../types';

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type }) => {
  if (!message) return null;

  const baseClasses = "p-4 rounded-xl text-sm mb-4 transition-all duration-300 shadow-md flex items-center";
  
  // Dark theme styles
  const typeClasses = type === 'success' 
    ? "bg-green-800 text-green-300 border border-green-700"
    : "bg-red-800 text-red-300 border border-red-700";

  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      <Icon className="h-5 w-5 flex-shrink-0 mr-2" />
      <span>{message}</span>
    </div>
  );
};

export default AlertMessage;
