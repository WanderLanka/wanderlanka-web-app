import React from 'react';

const Container = ({ 
  children, 
  size = 'default',
  padding = true,
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'max-w-4xl',
    default: 'max-w-7xl',
    lg: 'max-w-8xl',
    full: 'w-full'
  };

  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  const containerClasses = `${sizes[size]} mx-auto ${paddingClasses} ${className}`.trim();

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

export default Container;
