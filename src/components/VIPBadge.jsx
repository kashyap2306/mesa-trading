import React from 'react';
import { StarIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { TrophyIcon } from '@heroicons/react/24/outline';

const VIPBadge = ({ size = 'sm', variant = 'default', showText = true, className = '' }) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const variants = {
    default: {
      container: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg',
      glow: 'shadow-purple-500/25'
    },
    gold: {
      container: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg',
      glow: 'shadow-yellow-500/25'
    },
    premium: {
      container: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg',
      glow: 'shadow-indigo-500/25'
    },
    outline: {
      container: 'border-2 border-purple-500 text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800',
      glow: ''
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`
      inline-flex items-center space-x-1 rounded-full font-semibold
      ${sizeClasses[size]}
      ${currentVariant.container}
      ${currentVariant.glow}
      transform hover:scale-105 transition-all duration-200
      ${className}
    `}>
      {variant === 'gold' ? (
        <SparklesIcon className={`${iconSizes[size]} ${variant === 'outline' ? 'text-purple-500' : 'text-yellow-200'}`} />
      ) : (
        <StarIcon className={`${iconSizes[size]} ${variant === 'outline' ? 'text-purple-500' : 'text-white'}`} />
      )}
      {showText && (
        <span className="font-bold tracking-wide">
          VIP
        </span>
      )}
    </div>
  );
};

// Animated VIP Badge with sparkle effect
export const AnimatedVIPBadge = ({ size = 'sm', className = '' }) => {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <VIPBadge size={size} variant="premium" />
      
      {/* Sparkle animations */}
      <div className="absolute -top-1 -right-1">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
      </div>
      <div className="absolute -bottom-1 -left-1">
        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
      </div>
    </div>
  );
};

// VIP Status Indicator
export const VIPStatusIndicator = ({ isVip, size = 'sm', animated = false }) => {
  if (!isVip) return null;
  
  return animated ? (
    <AnimatedVIPBadge size={size} />
  ) : (
    <VIPBadge size={size} />
  );
};

// VIP Level Badge
export const VIPLevelBadge = ({ level = 1, size = 'sm', className = '' }) => {
  const getLevelVariant = (level) => {
    if (level >= 5) return 'gold';
    if (level >= 3) return 'premium';
    return 'default';
  };

  const getLevelText = (level) => {
    const levels = {
      1: 'VIP',
      2: 'VIP+',
      3: 'VIP Pro',
      4: 'VIP Elite',
      5: 'VIP Royal'
    };
    return levels[level] || `VIP L${level}`;
  };

  return (
    <div className={`
      inline-flex items-center space-x-1 rounded-full font-semibold
      ${size === 'xs' ? 'px-1.5 py-0.5 text-xs' : ''}
      ${size === 'sm' ? 'px-2 py-1 text-xs' : ''}
      ${size === 'md' ? 'px-3 py-1.5 text-sm' : ''}
      ${size === 'lg' ? 'px-4 py-2 text-base' : ''}
      ${getLevelVariant(level) === 'gold' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/25' : ''}
      ${getLevelVariant(level) === 'premium' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25' : ''}
      ${getLevelVariant(level) === 'default' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' : ''}
      transform hover:scale-105 transition-all duration-200
      ${className}
    `}>
      {level >= 5 ? (
        <TrophyIcon className={`
          ${size === 'xs' ? 'w-3 h-3' : ''}
          ${size === 'sm' ? 'w-3 h-3' : ''}
          ${size === 'md' ? 'w-4 h-4' : ''}
          ${size === 'lg' ? 'w-5 h-5' : ''}
          text-yellow-200
        `} />
      ) : (
        <StarIcon className={`
          ${size === 'xs' ? 'w-3 h-3' : ''}
          ${size === 'sm' ? 'w-3 h-3' : ''}
          ${size === 'md' ? 'w-4 h-4' : ''}
          ${size === 'lg' ? 'w-5 h-5' : ''}
          text-white
        `} />
      )}
      <span className="font-bold tracking-wide">
        {getLevelText(level)}
      </span>
    </div>
  );
};

export default VIPBadge;