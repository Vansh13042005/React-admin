import React from 'react';
import { X } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const Modal = ({ isOpen, title, children, onClose, onSubmit, submitText = 'Save', isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          {children}
        </div>
        
        <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : submitText}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Modal;