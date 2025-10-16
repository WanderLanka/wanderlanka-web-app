import React from 'react';

const Container = ({ 
  children, 
  size = 'default', // sm | default | lg | full
  padding = true,
  centered = false,
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'max-w-4xl',
    default: 'max-w-8xl',
    lg: 'max-w-8xl',
    full: 'w-full'
  };

  // Padding classes
  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  // Centered content
  const centeredClasses = centered ? 'flex justify-center' : '';

  // Combine all classes
  const containerClasses = `${sizes[size]} mx-auto ${paddingClasses} ${centeredClasses} ${className}`.trim();

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

export default Container;
