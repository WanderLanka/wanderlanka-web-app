import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-500',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800 focus:ring-gray-500',
    outline: 'border-2 border-green-500 text-green-700 hover:bg-green-50 focus:ring-green-500',
    ghost: 'text-gray-700 hover:text-green-600 hover:bg-green-50',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-2.5 text-base rounded-xl',
    lg: 'px-8 py-3 text-lg rounded-2xl',
    xl: 'px-12 py-4 text-xl rounded-2xl'
  };
  
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100 hover:translate-y-0' 
    : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
