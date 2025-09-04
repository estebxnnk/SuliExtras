import { useCallback } from 'react';
import { registrosEmpleadoService } from '../services';

export const useAccionesRegistrosEmpleado = ({
  setAlertState,
  setLoadingState,
  setSuccessState,
  setRegistros,
  setTiposHora,
  setOpenDetails,
  setOpenEdit,
  setConfirmDialog,
  setRegistroSeleccionado,
  setEditData,
  setLastUpdate
}) => {
  const initialize = useCallback(async () => {
    try {
      setLoadingState({ open: true, message: 'Cargando registros...', size: 'medium', initialOpen: true });
      const [regs, tipos] = await Promise.all([
        registrosEmpleadoService.fetchRegistros(),
        registrosEmpleadoService.fetchTiposHora()
      ]);
      setRegistros(regs);
      setTiposHora(tipos);
      setLastUpdate(Date.now());
    } catch (error) {
      setAlertState({ open: true, type: 'error', message: 'No se pudieron cargar los datos: ' + error.message, title: 'Error' });
    } finally {
      setLoadingState({ open: false, message: '', size: 'medium', initialOpen: false });
    }
  }, [setAlertState, setLoadingState, setRegistros, setTiposHora, setLastUpdate]);

  const handleRefresh = useCallback(async () => {
    try {
      setLoadingState({ open: true, message: 'Actualizando...', size: 'small', initialOpen: false });
      const regs = await registrosEmpleadoService.fetchRegistros();
      setRegistros(regs);
      setLastUpdate(Date.now());
      setAlertState({ open: true, type: 'success', message: 'Registros actualizados', title: 'Éxito' });
    } catch (error) {
      setAlertState({ open: true, type: 'error', message: 'No se pudieron actualizar: ' + error.message, title: 'Error' });
    } finally {
      setLoadingState({ open: false, message: '', size: 'small', initialOpen: false });
    }
  }, [setAlertState, setLoadingState, setRegistros, setLastUpdate]);

  const handleVer = useCallback((registro) => {
    setRegistroSeleccionado(registro);
    setOpenDetails(true);
  }, [setRegistroSeleccionado, setOpenDetails]);

  const handleEditar = useCallback((registro) => {
    setRegistroSeleccionado(registro);
    setEditData({
      id: registro.id,
      fecha: registro.fecha,
      horaIngreso: registro.horaIngreso,
      horaSalida: registro.horaSalida,
      ubicacion: registro.ubicacion,
      cantidadHorasExtra: registro.cantidadHorasExtra,
      justificacionHoraExtra: registro.justificacionHoraExtra || ''
    });
    setOpenEdit(true);
  }, [setRegistroSeleccionado, setEditData, setOpenEdit]);

  const handleEliminar = useCallback((registro) => {
    setConfirmDialog({ open: true, registro });
  }, [setConfirmDialog]);

  const handleConfirmEliminar = useCallback(async (getRegistro) => {
    try {
      const registro = getRegistro ? getRegistro() : null;
      const id = registro?.id;
      if (!id) return setConfirmDialog({ open: false, registro: null });
      setLoadingState({ open: true, message: 'Eliminando...', size: 'small', initialOpen: false });
      await registrosEmpleadoService.deleteRegistro(id);
      setAlertState({ open: true, type: 'success', message: 'Registro eliminado exitosamente', title: 'Éxito' });
      setConfirmDialog({ open: false, registro: null });
      const regs = await registrosEmpleadoService.fetchRegistros();
      setRegistros(regs);
      setLastUpdate(Date.now());
    } catch (error) {
      setAlertState({ open: true, type: 'error', message: 'No se pudo eliminar: ' + error.message, title: 'Error' });
    } finally {
      setLoadingState({ open: false, message: '', size: 'small', initialOpen: false });
    }
  }, [setAlertState, setLoadingState, setConfirmDialog, setRegistros, setLastUpdate]);

  const handleGuardarEdicion = useCallback(async (id, payload) => {
    try {
      setLoadingState({ open: true, message: 'Guardando...', size: 'small', initialOpen: false });
      await registrosEmpleadoService.updateRegistro(id, payload);
      setAlertState({ open: true, type: 'success', message: 'Registro actualizado exitosamente', title: 'Éxito' });
      setOpenEdit(false);
      const regs = await registrosEmpleadoService.fetchRegistros();
      setRegistros(regs);
      setLastUpdate(Date.now());
    } catch (error) {
      setAlertState({ open: true, type: 'error', message: 'No se pudo actualizar: ' + error.message, title: 'Error' });
    } finally {
      setLoadingState({ open: false, message: '', size: 'small', initialOpen: false });
    }
  }, [setAlertState, setLoadingState, setOpenEdit, setRegistros, setLastUpdate]);

  return {
    initialize,
    handleRefresh,
    handleVer,
    handleEditar,
    handleEliminar,
    handleConfirmEliminar,
    handleGuardarEdicion
  };
};


