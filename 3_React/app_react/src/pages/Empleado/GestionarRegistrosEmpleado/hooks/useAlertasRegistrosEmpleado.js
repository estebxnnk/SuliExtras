import { useState, useCallback } from 'react';

export const useAlertasRegistrosEmpleado = () => {
  const [alertState, setAlertState] = useState({
    open: false,
    type: 'info',
    message: '',
    title: ''
  });

  const [loadingState, setLoadingState] = useState({
    open: false,
    message: 'Cargando...',
    size: 'medium',
    initialOpen: false
  });

  const [successState, setSuccessState] = useState({
    open: false,
    type: 'download',
    message: '',
    title: ''
  });

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, open: false }));
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState(prev => ({ ...prev, open: false }));
  }, []);

  const hideSuccess = useCallback(() => {
    setSuccessState(prev => ({ ...prev, open: false }));
  }, []);

  return {
    alertState,
    setAlertState,
    hideAlert,
    loadingState,
    setLoadingState,
    hideLoading,
    successState,
    setSuccessState,
    hideSuccess
  };
};


