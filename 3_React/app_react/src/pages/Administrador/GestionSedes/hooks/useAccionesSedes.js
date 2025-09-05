import { useCallback } from 'react';
import { gestionSedesService } from '../services';

export const useAccionesSedes = (setAlertState, setLoadingState, setSedes, setSuccessState) => {
  
  const handleRefresh = useCallback(async (fetchFunction) => {
    setLoadingState({
      open: true,
      message: 'Actualizando lista de sedes...',
      size: 'medium'
    });
    
    try {
      await fetchFunction();
      setSuccessState({
        open: true,
        type: 'refresh',
        message: 'Lista de sedes actualizada correctamente'
      });
    } catch (error) {
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al actualizar: ' + error.message,
        title: 'Error de Actualización'
      });
    } finally {
      setLoadingState({ open: false });
    }
  }, [setAlertState, setLoadingState, setSuccessState]);

  const handleVerDetalles = useCallback((sede, setSedeSeleccionada, setOpenDialog) => {
    setSedeSeleccionada(sede);
    setOpenDialog(true);
  }, []);

  const handleVerHorarios = useCallback(async (sede, setSedeSeleccionada, setOpenHorarios) => {
    setSedeSeleccionada(sede);
    setOpenHorarios(true);
    
    // Aquí podrías cargar los horarios específicos de la sede si es necesario
    try {
      // const horarios = await gestionSedesService.fetchHorariosSede(sede.id);
      // setHorarios(horarios);
    } catch (error) {
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al cargar horarios: ' + error.message,
        title: 'Error'
      });
    }
  }, [setAlertState]);

  const handleCrearSede = useCallback(async (formData) => {
    setLoadingState({
      open: true,
      message: 'Creando nueva sede...',
      size: 'medium'
    });

    try {
      const nuevaSede = await gestionSedesService.crearSede(formData);
      
      setSuccessState({
        open: true,
        type: 'create',
        message: `Sede "${formData.nombre}" creada exitosamente`
      });

      return nuevaSede;
    } catch (error) {
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al crear sede: ' + error.message,
        title: 'Error de Creación'
      });
      throw error;
    } finally {
      setLoadingState({ open: false });
    }
  }, [setAlertState, setLoadingState, setSuccessState]);

  const handleActualizarSede = useCallback(async (sedeId, formData) => {
    setLoadingState({
      open: true,
      message: 'Actualizando sede...',
      size: 'medium'
    });

    try {
      const sedeActualizada = await gestionSedesService.actualizarSede(sedeId, formData);
      
      setSuccessState({
        open: true,
        type: 'edit',
        message: `Sede "${formData.nombre}" actualizada exitosamente`
      });

      return sedeActualizada;
    } catch (error) {
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al actualizar sede: ' + error.message,
        title: 'Error de Actualización'
      });
      throw error;
    } finally {
      setLoadingState({ open: false });
    }
  }, [setAlertState, setLoadingState, setSuccessState]);

  const handleEliminarSede = useCallback(async (sedeId, fetchSedes) => {
    // Confirmar eliminación
    const confirmar = window.confirm('¿Está seguro de que desea eliminar esta sede? Esta acción no se puede deshacer.');
    
    if (!confirmar) return;

    setLoadingState({
      open: true,
      message: 'Eliminando sede...',
      size: 'medium'
    });

    try {
      await gestionSedesService.eliminarSede(sedeId);
      
      setSuccessState({
        open: true,
        type: 'delete',
        message: 'Sede eliminada exitosamente'
      });

      // Refrescar lista
      await fetchSedes();
    } catch (error) {
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al eliminar sede: ' + error.message,
        title: 'Error de Eliminación'
      });
    } finally {
      setLoadingState({ open: false });
    }
  }, [setAlertState, setLoadingState, setSuccessState]);

  const handleEditarSede = useCallback((sede, setSedeSeleccionada, setOpenFormulario, setModoEdicion) => {
    setSedeSeleccionada(sede);
    setModoEdicion(true);
    setOpenFormulario(true);
  }, []);

  return {
    handleRefresh,
    handleVerDetalles,
    handleVerHorarios,
    handleCrearSede,
    handleActualizarSede,
    handleEliminarSede,
    handleEditarSede
  };
};
