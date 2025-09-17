import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const { getThemeClasses } = useDarkMode();
  const theme = getThemeClasses();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className={`w-full h-full border-4 border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full`}></div>
      </div>
      {text && (
        <p className={`${theme.text.secondary} text-sm font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;