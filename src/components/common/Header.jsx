import React from 'react';
import Logo from './Logo';
import Container from './Container';
import Avatar from './Avatar';
import Button from './Button';

const Header = ({ 
  brand,
  navigation,
  userSection,
  variant = 'default',
  sticky = true,
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-white border-b border-slate-200 shadow-sm',
    admin: 'bg-white border-b border-slate-200 shadow-sm',
    transport: 'bg-white border-b border-slate-200 shadow-sm',
    accommodation: 'bg-white border-b border-slate-200 shadow-sm',
    landing: 'bg-white/80 backdrop-blur-md shadow-xl border-b border-green-100/50'
  };

  const headerClasses = `${sticky ? 'sticky top-0 z-50' : ''} ${variants[variant]} ${className}`;

  return (
    <header className={headerClasses} {...props}>
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Brand Section */}
          <div className="flex items-center">
            {brand}
          </div>

          {/* Navigation Section */}
          {navigation && (
            <nav className="hidden md:flex items-center space-x-1">
              {navigation}
            </nav>
          )}

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {userSection}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
