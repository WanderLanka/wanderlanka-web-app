import React from 'react';

const Card = ({ 
  children, 
  className = '',
  hover = false,
  padding = 'default',
  shadow = 'default',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-2xl border border-gray-200 transition-all duration-300 relative overflow-hidden';
  
  const hoverClasses = hover ? 'hover:-translate-y-2 hover:shadow-2xl' : '';
  
  const paddingClasses = {
    none: 'p-0',
    small: 'p-4',
    default: 'p-6',
    large: 'p-8',
    'extra-large': 'p-10'
  };
  
  const shadowClasses = {
    none: 'shadow-none',
    light: 'shadow-sm',
    default: 'shadow-lg',
    heavy: 'shadow-xl',
    'extra-heavy': 'shadow-2xl'
  };
  
  const cardClasses = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`.trim();

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
