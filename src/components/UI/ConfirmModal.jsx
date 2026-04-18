import React from 'react';
import Card from './Card';
import Button from './Button';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDangerous = false, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-sm w-full">
        <div className="text-center">
          <div className="mb-4 text-5xl">
            {isDangerous ? '⚠️' : '❓'}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          <div className="flex gap-3 justify-center">
            <Button 
              variant="ghost" 
              onClick={onCancel} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant={isDangerous ? 'danger' : 'primary'} 
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmModal;