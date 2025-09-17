import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const DarkModeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleDarkMode, getThemeClasses } = useDarkMode();
  const theme = getThemeClasses();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex items-center justify-center
        w-12 h-6 rounded-full transition-all duration-300 ease-in-out
        ${isDarkMode 
          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/25'
        }
        hover:scale-105 active:scale-95
        ${className}
      `}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Circle */}
      <div
        className={`
          absolute w-5 h-5 rounded-full transition-all duration-300 ease-in-out
          ${isDarkMode 
            ? 'translate-x-3 bg-white shadow-lg' 
            : '-translate-x-3 bg-slate-900 shadow-lg'
          }
          flex items-center justify-center
        `}
      >
        {isDarkMode ? (
          <Moon className="w-3 h-3 text-slate-700" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-400" />
        )}
      </div>
      
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <Sun 
          className={`w-3 h-3 transition-opacity duration-300 ${
            isDarkMode ? 'opacity-30 text-white' : 'opacity-0'
          }`} 
        />
        <Moon 
          className={`w-3 h-3 transition-opacity duration-300 ${
            isDarkMode ? 'opacity-0' : 'opacity-30 text-white'
          }`} 
        />
      </div>
      
      {/* Neon Glow Effect */}
      <div 
        className={`
          absolute inset-0 rounded-full opacity-50 blur-sm
          ${isDarkMode 
            ? 'bg-gradient-to-r from-cyan-400 to-blue-400' 
            : 'bg-gradient-to-r from-yellow-300 to-orange-400'
          }
        `}
      />
    </button>
  );
};

export default DarkModeToggle;