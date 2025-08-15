import { useState, useCallback } from 'react';

export const useUniversalAlerts = () => {
  const [alertState, setAlertState] = useState({
    open: false,
    type: 'info',
    message: '',
    title: '',
    autoHideDuration: 5000
  });

  const showAlert = useCallback((type, message, title = '', autoHideDuration = 5000) => {
    setAlertState({
      open: true,
      type,
      message,
      title,
      autoHideDuration
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  const showSuccess = useCallback((message, title = '¡Éxito!') => {
    showAlert('success', message, title, 3000);
  }, [showAlert]);

  const showError = useCallback((message, title = 'Error') => {
    showAlert('error', message, title, 7000);
  }, [showAlert]);

  const showWarning = useCallback((message, title = 'Advertencia') => {
    showAlert('warning', message, title, 5000);
  }, [showAlert]);

  const showInfo = useCallback((message, title = 'Información') => {
    showAlert('info', message, title, 4000);
  }, [showAlert]);

  const showEdicion = useCallback((message, title = 'Registro Editado') => {
    showAlert('edicion', message, title, 4000);
  }, [showAlert]);

  const showEliminacion = useCallback((message, title = 'Registro Eliminado') => {
    showAlert('eliminacion', message, title, 4000);
  }, [showAlert]);

  const showAprobacion = useCallback((message, title = 'Registro Aprobado') => {
    showAlert('aprobacion', message, title, 4000);
  }, [showAlert]);

  const showRechazo = useCallback((message, title = 'Registro Rechazado') => {
    showAlert('rechazo', message, title, 4000);
  }, [showAlert]);

  const showSesion = useCallback((message, title = 'Sesión Cerrada') => {
    showAlert('sesion', message, title, 3000);
  }, [showAlert]);

  return {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showEdicion,
    showEliminacion,
    showAprobacion,
    showRechazo,
    showSesion
  };
};
