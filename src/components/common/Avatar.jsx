import React from 'react';

const Avatar = ({ 
  name = 'User',
  size = 'md',
  initials,
  bgColor = 'bg-gradient-to-br from-slate-600 to-slate-700',
  textColor = 'text-white',
  className = '',
  onClick,
  ...props 
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const displayInitials = initials || name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  const avatarClasses = `${sizes[size]} ${bgColor} ${textColor} rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
    onClick ? 'cursor-pointer hover:scale-110' : ''
  } ${className}`;

  return (
    <div 
      className={avatarClasses}
      onClick={onClick}
      {...props}
    >
      {displayInitials}
    </div>
  );
};

export default Avatar;
