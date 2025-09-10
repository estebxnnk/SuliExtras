import { useState } from 'react';
import { gestionarRegistrosHorasExtraService } from '../services/gestionarRegistrosHorasExtraService';

export const useCrearRegistro = (cargarDatos, showSuccess, showError) => {
  const [loading, setLoading] = useState(false);

  const crearRegistro = async (nuevoRegistro) => {
    setLoading(true);
    
    try {
      // Validación mínima para endpoint /auto-horas
      if (!nuevoRegistro.fecha || !nuevoRegistro.usuarioId || !nuevoRegistro.horaSalida || !nuevoRegistro.ubicacion) {
        throw new Error('Fecha, empleado, hora de salida y ubicación son obligatorios');
      }

      // Llamada real a la API para crear el registro
      const resultado = await gestionarRegistrosHorasExtraService.createRegistro(nuevoRegistro);
      console.log('Registro creado exitosamente:', resultado);

      console.log('Resultado:', resultado);
      
      showSuccess('Registro creado exitosamente');
      
      // Recargar los datos
      await cargarDatos();
      
      return true;
      
    } catch (error) {
      console.error('Error al crear registro:', error);
      showError('Error al crear el registro: ' + (error?.message || 'Error desconocido'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    crearRegistro,
    loading
  };
};
