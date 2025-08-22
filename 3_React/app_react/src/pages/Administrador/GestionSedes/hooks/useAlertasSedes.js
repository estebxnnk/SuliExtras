import { useState } from 'react';

export const useAlertasSedes = () => {
  // Estado de alertas
  const [alertState, setAlertState] = useState({
    open: false,
    type: 'info', // 'success', 'error', 'warning', 'info'
    message: '',
    title: ''
  });

  // Estado de loading
  const [loadingState, setLoadingState] = useState({
    open: false,
    message: 'Cargando...',
    size: 'medium' // 'small', 'medium', 'large'
  });

  // Estado de success
  const [successState, setSuccessState] = useState({
    open: false,
    type: 'create', // 'create', 'edit', 'delete', 'refresh'
    message: ''
  });

  // Funciones para ocultar
  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, open: false }));
  };

  const hideLoading = () => {
    setLoadingState(prev => ({ ...prev, open: false }));
  };

  const hideSuccess = () => {
    setSuccessState(prev => ({ ...prev, open: false }));
  };

  return {
    // Estados
    alertState,
    setAlertState,
    loadingState,
    setLoadingState,
    successState,
    setSuccessState,

    // Funciones
    hideAlert,
    hideLoading,
    hideSuccess
  };
};
