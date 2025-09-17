import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

// Primary Button Component
export const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-lg hover:shadow-xl',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-indigo-500 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-400 dark:hover:text-white',
    ghost: 'text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-900/20',
    link: 'text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline focus:ring-indigo-500 dark:text-indigo-400'
  };
  
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base'
  };
  
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-5 h-5'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <ArrowPathIcon className={`${iconSizes[size]} mr-2 animate-spin`} />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} />
      )}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`} />
      )}
    </button>
  );
};

// Icon Button Component
export const IconButton = ({ 
  icon: Icon, 
  onClick, 
  variant = 'ghost', 
  size = 'md', 
  disabled = false,
  loading = false,
  tooltip,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-400 dark:hover:bg-gray-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
  };
  
  const sizes = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3'
  };
  
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      title={tooltip}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <ArrowPathIcon className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Icon className={iconSizes[size]} />
      )}
    </button>
  );
};

// Button Group Component
export const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex rounded-lg shadow-sm ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;
        
        return React.cloneElement(child, {
          className: `
            ${child.props.className || ''}
            ${!isFirst ? '-ml-px' : ''}
            ${isFirst ? 'rounded-r-none' : ''}
            ${isLast ? 'rounded-l-none' : ''}
            ${!isFirst && !isLast ? 'rounded-none' : ''}
          `
        });
      })}
    </div>
  );
};

// Floating Action Button
export const FloatingActionButton = ({ 
  icon: Icon, 
  onClick, 
  variant = 'primary',
  size = 'lg',
  position = 'bottom-right',
  className = '',
  ...props 
}) => {
  const baseClasses = 'fixed inline-flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 z-50';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500'
  };
  
  const sizes = {
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16'
  };
  
  const iconSizes = {
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };
  
  const positions = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${positions[position]}
        ${className}
      `}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

// Toggle Button
export const ToggleButton = ({ 
  isToggled, 
  onToggle, 
  children, 
  size = 'md',
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: isToggled 
      ? 'bg-indigo-600 text-white focus:ring-indigo-500 shadow-lg' 
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
    success: isToggled 
      ? 'bg-green-600 text-white focus:ring-green-500 shadow-lg' 
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <button
      onClick={onToggle}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Copy Button with feedback
export const CopyButton = ({ 
  textToCopy, 
  children = 'Copy', 
  successText = 'Copied!',
  size = 'sm',
  variant = 'outline',
  className = '',
  ...props 
}) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  return (
    <Button
      onClick={handleCopy}
      variant={copied ? 'success' : variant}
      size={size}
      className={className}
      {...props}
    >
      {copied ? successText : children}
    </Button>
  );
};

export default Button;