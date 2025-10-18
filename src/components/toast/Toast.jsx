import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaHeart, FaBookmark, FaExclamationTriangle } from 'react-icons/fa';
import './style.scss';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck />;
      case 'error':
        return <FaTimes />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'favourite':
        return <FaHeart />;
      case 'watchlist':
        return <FaBookmark />;
      default:
        return <FaCheck />;
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'favourite':
        return 'favourite';
      case 'watchlist':
        return 'watchlist';
      default:
        return 'success';
    }
  };

  return (
    <div className={`toast ${getTypeClass()} ${isVisible ? 'show' : 'hide'}`}>
      <div className="toastIcon">
        {getIcon()}
      </div>
      <div className="toastContent">
        <p className="toastMessage">{message}</p>
      </div>
      <button className="toastClose" onClick={() => setIsVisible(false)}>
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;



