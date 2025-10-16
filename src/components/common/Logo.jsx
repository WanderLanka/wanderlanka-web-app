import React from 'react';
import wanderLogo from '../../assets/images/wander_logo.png';

const Logo = ({ 
  size = 'md', 
  variant = 'default',
  showText = true, 
  className = '',
  logoSrc,
  brandName = 'WanderLanka'
}) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const variants = {
    default: {
      container: 'rounded-2xl',
      gradient: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
      textGradient: 'from-green-600 via-emerald-600 to-teal-600'
    },
    admin: {
      container: 'rounded-lg',
      gradient: 'bg-gradient-to-br from-blue-600 to-blue-700',
      textGradient: 'from-blue-600 to-blue-700'
    },
    transport: {
      container: 'rounded-lg',
      gradient: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
      textGradient: 'from-emerald-600 to-emerald-700'
    },
    accommodation: {
      container: 'rounded-lg',
      gradient: 'bg-gradient-to-br from-blue-600 to-blue-700',
      textGradient: 'from-blue-600 to-blue-700'
    }
  };

  const currentVariant = variants[variant];
  
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {logoSrc || variant === 'default' ? (
        <div className={`${sizes[size]} ${currentVariant.container} flex items-center justify-center overflow-hidden hover:scale-110 transition-transform duration-300`}>
          <img 
            src={logoSrc || wanderLogo} 
            alt={`${brandName} Logo`} 
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className={`${sizes[size]} ${currentVariant.gradient} ${currentVariant.container} flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-150`}>
          <span className="text-white font-bold text-lg">W</span>
        </div>
      )}
      {showText && variant === 'default' && (
        <div>
          <span className={`font-bold ${textSizes[size]} bg-gradient-to-r ${currentVariant.textGradient} bg-clip-text text-transparent hover:scale-105 transition-transform duration-300`}>
            {brandName}
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
