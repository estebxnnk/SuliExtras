import { useState } from 'react';
import { gestionarRegistrosHorasExtraService } from '../services/gestionarRegistrosHorasExtraService';

export const useCrearRegistro = (cargarDatos, showSuccess, showError) => {
  const [loading, setLoading] = useState(false);

  const crearRegistro = async (nuevoRegistro) => {
    setLoading(true);
    
    try {
      // Validar que el registro tenga todos los campos requeridos
      if (!nuevoRegistro.fecha || !nuevoRegistro.horaIngreso || !nuevoRegistro.horaSalida || 
          !nuevoRegistro.ubicacion || !nuevoRegistro.usuario || !nuevoRegistro.cantidadHorasExtra || 
          !nuevoRegistro.horas || nuevoRegistro.horas.length === 0)  {
        throw new Error('Todos los campos son obligatorios');
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
      showError('Error al crear el registro: ' + error.message);
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
