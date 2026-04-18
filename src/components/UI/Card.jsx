import React from 'react';

const Card = ({ children, className = "", hoverable = true }) => {
  return (
    <div className={`
      bg-white dark:bg-gray-900 
      rounded-2xl 
      border border-gray-200 dark:border-gray-700 
      p-6 
      shadow-lg dark:shadow-none 
      ${hoverable ? 'hover:shadow-xl dark:hover:shadow-none transition-shadow duration-300' : ''} 
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;