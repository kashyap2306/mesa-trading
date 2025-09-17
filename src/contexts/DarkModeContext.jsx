import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode for crypto theme
  const [isGlassmorphism, setIsGlassmorphism] = useState(true);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('mesa-trading-theme');
    const savedGlass = localStorage.getItem('mesa-trading-glassmorphism');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    if (savedGlass) {
      setIsGlassmorphism(savedGlass === 'true');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('mesa-trading-theme', newMode ? 'dark' : 'light');
  };

  const toggleGlassmorphism = () => {
    const newGlass = !isGlassmorphism;
    setIsGlassmorphism(newGlass);
    localStorage.setItem('mesa-trading-glassmorphism', newGlass.toString());
  };

  const getThemeClasses = () => {
    const baseClasses = {
      // Background gradients - Modern crypto exchange style
      background: isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-black'
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
      
      // Card backgrounds with enhanced glassmorphism
      card: isDarkMode
        ? (isGlassmorphism ? 'bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10' : 'bg-slate-800/90 border border-slate-700/50')
        : (isGlassmorphism ? 'bg-white/60 backdrop-blur-xl border border-blue-500/20 shadow-xl shadow-blue-500/10' : 'bg-white/95 border border-slate-200'),
      
      // Text colors - Enhanced contrast for better readability
      text: {
        primary: isDarkMode ? 'text-white' : 'text-slate-900',
        secondary: isDarkMode ? 'text-slate-300' : 'text-slate-600',
        accent: isDarkMode ? 'text-cyan-400' : 'text-blue-600',
        muted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
        success: isDarkMode ? 'text-green-400' : 'text-green-700',
        warning: isDarkMode ? 'text-yellow-400' : 'text-yellow-700',
        error: isDarkMode ? 'text-red-400' : 'text-red-700',
        inverse: isDarkMode ? 'text-slate-900' : 'text-white'
      },
      
      // Enhanced neon effects for crypto theme
      neon: {
        glow: isDarkMode ? 'shadow-cyan-500/25 shadow-2xl' : 'shadow-blue-500/20 shadow-xl',
        border: isDarkMode ? 'border-cyan-500/30' : 'border-blue-500/30',
        gradient: isDarkMode 
          ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500'
          : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600',
        text: isDarkMode
          ? 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
      },
      
      // Navigation with better mobile support
      nav: isDarkMode
        ? (isGlassmorphism ? 'backdrop-blur-xl bg-black/30 border-b border-cyan-500/20' : 'bg-slate-900/95 border-b border-slate-700')
        : (isGlassmorphism ? 'backdrop-blur-xl bg-white/80 border-b border-blue-500/20' : 'bg-white/95 border-b border-slate-200'),
      
      // Enhanced button styles
      button: {
        primary: isDarkMode
          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30'
          : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30',
        secondary: isDarkMode
          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300',
        ghost: isDarkMode
          ? 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
          : 'text-blue-600 hover:text-blue-700 hover:bg-blue-500/10'
      },
      
      // Input styles
      input: isDarkMode
        ? 'bg-black/20 border border-cyan-500/30 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20'
        : 'bg-white/80 border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20',
      
      // Modal and overlay styles
      modal: isDarkMode
        ? 'bg-black/60 backdrop-blur-xl'
        : 'bg-white/60 backdrop-blur-xl',
      
      // Status indicators
      status: {
        online: 'bg-green-500',
        offline: 'bg-slate-500',
        pending: 'bg-yellow-500',
        error: 'bg-red-500'
      }
    };
    
    return baseClasses;
  };

  const value = {
    isDarkMode,
    isGlassmorphism,
    toggleDarkMode,
    toggleGlassmorphism,
    getThemeClasses
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;