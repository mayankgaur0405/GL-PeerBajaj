import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showModeSwitchToast = (targetMode, onConfirm) => {
    const id = addToast(
      `You need to switch to ${targetMode} Mode to view this section.`,
      'warning',
      0 // Don't auto-remove
    );
    
    // Add confirm/cancel buttons
    const confirmToast = {
      id,
      message: `You need to switch to ${targetMode} Mode to view this section.`,
      type: 'warning',
      duration: 0,
      actions: [
        {
          label: 'OK',
          action: () => {
            onConfirm();
            removeToast(id);
          }
        },
        {
          label: 'Cancel',
          action: () => removeToast(id)
        }
      ]
    };
    
    setToasts(prev => prev.map(toast => toast.id === id ? confirmToast : toast));
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    showModeSwitchToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`max-w-sm p-4 rounded-lg shadow-lg border-l-4 ${
            toast.type === 'success' ? 'bg-green-500 border-green-600 text-white' :
            toast.type === 'error' ? 'bg-red-500 border-red-600 text-white' :
            toast.type === 'warning' ? 'bg-yellow-500 border-yellow-600 text-white' :
            'bg-blue-500 border-blue-600 text-white'
          } animate-fadeInUp`}
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-white/80 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {toast.actions && (
            <div className="mt-3 flex gap-2">
              {toast.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="px-3 py-1 text-xs font-medium bg-white/20 hover:bg-white/30 rounded transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};



