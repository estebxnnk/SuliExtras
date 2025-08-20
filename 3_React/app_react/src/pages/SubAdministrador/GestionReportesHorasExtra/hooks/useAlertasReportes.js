import { useState, useCallback } from 'react';

export const useAlertasReportes = () => {
  const [alertState, setAlertState] = useState({
    open: false,
    type: 'info',
    message: '',
    title: ''
  });

  const hideAlert = useCallback(() => {
    setAlertState({ ...alertState, open: false });
  }, [alertState]);

  const showAlert = useCallback((type, message, title = '') => {
    setAlertState({
      open: true,
      type,
      message,
      title
    });
  }, []);

  const showSuccess = useCallback((message, title = 'Éxito') => {
    showAlert('success', message, title);
  }, [showAlert]);

  const showError = useCallback((message, title = 'Error') => {
    showAlert('error', message, title);
  }, [showAlert]);

  const showWarning = useCallback((message, title = 'Advertencia') => {
    showAlert('warning', message, title);
  }, [showAlert]);

  const showInfo = useCallback((message, title = 'Información') => {
    showAlert('info', message, title);
  }, [showAlert]);

  return {
    alertState,
    setAlertState,
    hideAlert,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
