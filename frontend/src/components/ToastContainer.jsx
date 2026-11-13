import React, { useEffect, useState } from 'react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const detail = e.detail;
      const text = typeof detail === 'string' ? detail : detail?.text || 'Notification';
      const type = typeof detail === 'object' && detail?.type ? detail.type : 'info';
      const id = Date.now() + Math.random();

      setToasts(prev => [...prev, { id, text, type }]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3500);
    };

    window.addEventListener('dealpilot-toast', handleToast);
    return () => window.removeEventListener('dealpilot-toast', handleToast);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-bubble ${toast.type}`}>
          <span className="toast-icon">
            {toast.type === 'success' ? '✓' : toast.type === 'warning' ? '⚠' : '✦'}
          </span>
          <span className="toast-message">{toast.text}</span>
        </div>
      ))}
    </div>
  );
}
