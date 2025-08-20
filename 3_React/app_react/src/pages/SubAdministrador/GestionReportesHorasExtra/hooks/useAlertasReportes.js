import { useState, useCallback } from 'react';

export const useAlertasReportes = () => {
  const [alertState, setAlertState] = useState({
    open: false,
    type: 'info',
    message: '',
    title: ''
  });

  const [loadingState, setLoadingState] = useState({
    open: false,
    message: 'Cargando...',
    size: 'medium'
  });

  const [successState, setSuccessState] = useState({
    open: false,
    type: 'create', // create, edit, delete, approve, reject, stateChange
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

  const showSuccessAlert = useCallback((message, title = 'Éxito') => {
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

  const hideLoading = useCallback(() => {
    setLoadingState({ ...loadingState, open: false });
  }, [loadingState]);

  const showLoading = useCallback((message = 'Cargando...', size = 'medium') => {
    setLoadingState({ open: true, message, size });
  }, []);

  const hideSuccess = useCallback(() => {
    setSuccessState({ ...successState, open: false });
  }, [successState]);

  const showSuccess = useCallback((type = 'create', message = '', title = '') => {
    setSuccessState({ open: true, type, message, title });
  }, []);

  return {
    alertState,
    setAlertState,
    hideAlert,
    showAlert,
    showSuccessAlert,
    showError,
    showWarning,
    showInfo,
    loadingState,
    setLoadingState,
    hideLoading,
    showLoading,
    successState,
    setSuccessState,
    hideSuccess
  };
};
