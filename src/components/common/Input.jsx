import React from 'react';

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  disabled = false,
  required = false,
  size = 'md',
  variant = 'default',
  icon,
  className = '',
  labelClassName = '',
  ...props 
}) => {
  const baseClasses = 'w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    default: 'border border-gray-300 bg-white focus:ring-green-500 focus:border-green-500',
    outline: 'border-2 border-gray-300 bg-white focus:ring-green-500 focus:border-green-500',
    filled: 'border border-gray-300 bg-gray-50 focus:ring-green-500 focus:border-green-500 focus:bg-white'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-base rounded-xl',
    lg: 'px-5 py-3 text-lg rounded-xl'
  };

  const stateClasses = error 
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
    : success 
    ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
    : variants[variant];

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
    : '';

  const inputClasses = `${baseClasses} ${sizes[size]} ${stateClasses} ${disabledClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          className={icon ? `pl-10 ${inputClasses}` : inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="mt-2 text-sm text-green-600">{success}</p>
      )}
    </div>
  );
};

export default Input;
