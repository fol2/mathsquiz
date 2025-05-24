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
    small: 'text-[2rem]',
    medium: 'text-[3rem]',
    large: 'text-[4rem]'
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