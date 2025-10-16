import React from 'react';

const NavButton = ({ 
  children, 
  onClick, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'text-gray-700 hover:text-green-600 font-medium transition-all duration-300 hover:scale-110 hover:-translate-y-1 relative group',
    primary: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-green-400 px-6 py-2.5 rounded-full font-semibold hover:bg-green-50 font-semibold text-gray-700 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl',
    mobile: 'block w-full text-left px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl font-medium transition-all',
    mobilePrimary: 'flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all',
    mobileSecondary: 'flex-1 border-2 bg-gradient-to-r from-slate-500 to-slate-900 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all'
  };
  
  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {variant === 'default' && (
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
      )}
    </button>
  );
};

export default NavButton;
