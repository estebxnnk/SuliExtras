import { useCallback } from 'react';
import { gestionarRegistrosHorasExtraService } from '../services/gestionarRegistrosHorasExtraService';

export const useAccionesRegistros = (cargarDatos, showSuccess, showError) => {
  const aprobarRegistro = useCallback(async (registro) => {
    try {
      await gestionarRegistrosHorasExtraService.aprobarRegistro(registro.id);
      showSuccess('Registro aprobado exitosamente');
      await cargarDatos();
      return true;
    } catch (error) {
      showError(`Error al aprobar el registro: ${error.message}`);
      return false;
    }
  }, [cargarDatos, showSuccess, showError]);

  const rechazarRegistro = useCallback(async (registro) => {
    try {
      await gestionarRegistrosHorasExtraService.rechazarRegistro(registro.id);
      showSuccess('Registro rechazado exitosamente');
      await cargarDatos();
      return true;
    } catch (error) {
      showError(`Error al rechazar el registro: ${error.message}`);
      return false;
    }
  }, [cargarDatos, showSuccess, showError]);

  const eliminarRegistro = useCallback(async (registro) => {
    try {
      await gestionarRegistrosHorasExtraService.deleteRegistro(registro.id);
      showSuccess('Registro eliminado exitosamente');
      await cargarDatos();
      return true;
    } catch (error) {
      showError(`Error al eliminar el registro: ${error.message}`);
      return false;
    }
  }, [cargarDatos, showSuccess, showError]);

  const editarRegistro = useCallback(async (id, data, soloEstado = false) => {
    try {
      if (soloEstado) {
        await gestionarRegistrosHorasExtraService.updateRegistro(id, { estado: data.estado });
        showSuccess('Estado del registro cambiado exitosamente');
      } else {
        const dataToSend = {
          ...data,
          horas: [
            {
              id: data.tipoHoraId,
              cantidad: data.cantidadHorasExtra
            }
          ]
        };
        delete dataToSend.tipoHoraId;
        
        await gestionarRegistrosHorasExtraService.updateRegistro(id, dataToSend);
        showSuccess('Registro editado exitosamente');
      }
      
      await cargarDatos();
      return true;
    } catch (error) {
      showError(`Error al actualizar el registro: ${error.message}`);
      return false;
    }
  }, [cargarDatos, showSuccess, showError]);

  return {
    aprobarRegistro,
    rechazarRegistro,
    eliminarRegistro,
    editarRegistro
  };
};
