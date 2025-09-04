import React, { useEffect, useState } from 'react';
import CrearRegistroSemanalUniversal from '../../../../components/dialog/CrearRegistroSemanalUniversal';
import { registrosHorasExtraService } from '../../../../components/services/registrosHorasExtraService';
import { SubAdminUniversalAlertUniversal, SubAdminLoadingSpinner, SubAdminSuccessSpinnerUniversal } from '../../../../components';

/**
 * Wrapper para usar el diálogo de creación semanal dentro del módulo de Empleado.
 * Selecciona automáticamente el usuario autenticado y oculta el selector de empleado.
 */
const CrearRegistrosSemanalEmpleadoDialog = ({ open, onClose, tiposHora = [], usuarios = [], onCreado, isMobile }) => {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [alertState, setAlertState] = useState({ open: false, type: 'info', message: '', title: '' });
  const [loadingState, setLoadingState] = useState({ open: false, message: '', size: 'small' });
  const [successState, setSuccessState] = useState({ open: false, message: '', title: '' });

  useEffect(() => {
    let active = true;
    const fetchUser = async () => {
      try {
        if (!userId) return;
        // Intentar endpoint directo por ID para obtener datos completos
        try {
          const byId = await registrosHorasExtraService.getUsuarioById(userId);
          if (active && byId) {
            setUsuarioInfo(byId);
            return;
          }
        } catch (_) {}
        // Alternativa: lista completa y filtrar
        const fetched = await registrosHorasExtraService.getUsuarios();
        const match = Array.isArray(fetched) ? fetched.find(u => String(u.id) === String(userId)) : null;
        if (active) setUsuarioInfo(match || null);
      } catch (_) {
        // ignorar errores para UI
      }
    };
    fetchUser();
    return () => { active = false; };
  }, [userId, usuarios]);

  const handleCrearRegistrosBulk = async (payload) => {
    // Forzar el usuarioId al autenticado
    const forced = { ...payload, usuarioId: userId };
    setLoadingState({ open: true, message: 'Creando registros...', size: 'small' });
    try {
      const result = await registrosHorasExtraService.createRegistrosBulk(forced);
      setLoadingState({ open: false, message: '', size: 'small' });
      setSuccessState({ open: true, title: 'Éxito', message: '¡Registros creados exitosamente!' });
      if (typeof onCreado === 'function') {
        try { await onCreado(result); } catch (_) {}
      }
      // Cerrar el diálogo tras un breve delay para permitir ver el éxito
      setTimeout(() => {
        setSuccessState({ open: false, title: '', message: '' });
        onClose?.();
      }, 900);
      return result;
    } catch (error) {
      setLoadingState({ open: false, message: '', size: 'small' });
      const message = error?.message || 'Error desconocido al crear los registros';
      setAlertState({ open: true, type: 'error', title: 'Error', message });
      throw error; // permitir que el hijo muestre su alerta local si aplica
    }
  };

  return (
    <>
      <CrearRegistroSemanalUniversal
        open={open}
        onClose={() => {
          setUsuarioInfo(prev => prev);
          onClose?.();
        }}
        tiposHora={tiposHora}
        usuarios={usuarioInfo ? [usuarioInfo] : usuarios}
        onCrearRegistrosBulk={handleCrearRegistrosBulk}
        isMobile={isMobile}
        defaultUsuarioId={userId}
        hideEmployeeSelector
      />

      <SubAdminUniversalAlertUniversal
        open={alertState.open}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onClose={() => setAlertState(prev => ({ ...prev, open: false }))}
        showLogo={true}
        autoHideDuration={4000}
      />

      <SubAdminLoadingSpinner
        open={loadingState.open}
        message={loadingState.message}
        size={loadingState.size}
        showLogo={true}
      />

      <SubAdminSuccessSpinnerUniversal
        open={successState.open}
        title={successState.title}
        message={successState.message}
        onClose={() => setSuccessState({ open: false, title: '', message: '' })}
      />
    </>
  );
};

export default CrearRegistrosSemanalEmpleadoDialog;


