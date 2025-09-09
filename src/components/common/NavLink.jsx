import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ 
  to, 
  children, 
  activeClass = 'bg-blue-50 text-blue-700 shadow-sm',
  inactiveClass = 'text-slate-600 hover:text-slate-800 hover:bg-slate-50',
  className = '',
  icon,
  exactMatch = true,
  ...props 
}) => {
  const location = useLocation();
  
  const isActive = exactMatch 
    ? location.pathname === to
    : location.pathname.startsWith(to);

  const linkClasses = `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
    isActive ? activeClass : inactiveClass
  } ${className}`;

  return (
    <Link to={to} className={linkClasses} {...props}>
      {icon && <span className="text-base">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
};

export default NavLink;
