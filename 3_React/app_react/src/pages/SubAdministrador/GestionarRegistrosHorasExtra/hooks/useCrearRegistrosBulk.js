import { useState } from 'react';
import { gestionarRegistrosHorasExtraService } from '../services/gestionarRegistrosHorasExtraService';

export const useCrearRegistrosBulk = (cargarDatos, showSuccess, showError) => {
  const [loading, setLoading] = useState(false);

  const crearRegistrosBulk = async (usuarioId, registros, options = {}) => {
    setLoading(true);

    try {
      if (!usuarioId || !Array.isArray(registros) || registros.length === 0) {
        throw new Error('usuarioId y registros son obligatorios');
      }

      const payload = { usuarioId, registros, ...options };
      const resultado = await gestionarRegistrosHorasExtraService.createRegistrosBulk(payload);

      showSuccess(`Registros creados: ${resultado?.total ?? registros.length}`);
      await cargarDatos?.();
      return resultado;
    } catch (error) {
      console.error('Error al crear registros bulk:', error);
      showError?.(error.message || 'Error al crear registros');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { crearRegistrosBulk, loading };
};


