import React from 'react';

const Input = ({ 
  label, 
  error, 
  required = false, 
  type = 'text',
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-4 py-2 
          border border-gray-300 dark:border-gray-600 
          rounded-lg 
          bg-white dark:bg-gray-800 
          text-gray-900 dark:text-white 
          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          transition-colors
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;