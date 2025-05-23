import React from 'react';
import { SparklesIcon } from './Icons';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const containerClasses = {
    small: 'space-y-2',
    medium: 'space-y-4',
    large: 'space-y-6'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
      <SparklesIcon 
        className={`${sizeClasses[size]} text-yellow-300 animate-spin`}
        aria-hidden="true"
      />
      <p className="text-white font-semibold text-center" aria-live="polite">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner; 