import React, { createContext, useContext, useState } from 'react';
import Toast from './Toast';

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

  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, duration = 3000) => {
    return addToast(message, 'success', duration);
  };

  const showError = (message, duration = 4000) => {
    return addToast(message, 'error', duration);
  };

  const showWarning = (message, duration = 4000) => {
    return addToast(message, 'warning', duration);
  };

  const showFavourite = (message, duration = 3000) => {
    return addToast(message, 'favourite', duration);
  };

  const showWatchlist = (message, duration = 3000) => {
    return addToast(message, 'watchlist', duration);
  };

  return (
    <ToastContext.Provider value={{
      addToast,
      removeToast,
      showSuccess,
      showError,
      showWarning,
      showFavourite,
      showWatchlist
    }}>
      {children}
      <div className="toastContainer">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};






