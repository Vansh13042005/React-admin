import React, { useEffect } from 'react';
import { Check, AlertCircle, Bell, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Toast = ({ toast, onClose }) => {
  const bgColor = toast.type === 'success' 
    ? 'bg-green-500' 
    : toast.type === 'error' 
    ? 'bg-red-500' 
    : 'bg-blue-500';

  const Icon = toast.type === 'success' 
    ? Check 
    : toast.type === 'error' 
    ? AlertCircle 
    : Bell;

  return (
    <div className={`${bgColor} text-white px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg animate-fadeIn max-w-md`}>
      <Icon size={18} />
      <span className="flex-1">{toast.message}</span>
      <button 
        onClick={onClose}
        className="hover:opacity-75 transition-opacity"
      >
        <X size={18} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 space-y-3 z-50">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
export { Toast };