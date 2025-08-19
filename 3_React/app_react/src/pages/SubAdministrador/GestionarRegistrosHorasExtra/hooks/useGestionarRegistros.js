import { useState, useCallback } from 'react';
import { gestionarRegistrosHorasExtraService } from '../services/gestionarRegistrosHorasExtraService';

export const useGestionarRegistros = () => {
  const [registros, setRegistros] = useState([]);
  const [tiposHora, setTiposHora] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      
      const [registrosData, tiposHoraData, usuariosData] = await Promise.all([
        gestionarRegistrosHorasExtraService.getRegistros(),
        gestionarRegistrosHorasExtraService.getTiposHora(),
        gestionarRegistrosHorasExtraService.getUsuarios()
      ]);

      setRegistros(registrosData);
      setTiposHora(tiposHoraData);
      setUsuarios(usuariosData);
      
      return { registros: registrosData, tiposHora: tiposHoraData, usuarios: usuariosData };
    } catch (error) {
      console.error('Error al cargar datos:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const refrescarDatos = useCallback(async () => {
    try {
      setRefreshing(true);
      await cargarDatos();
    } catch (error) {
      throw error;
    } finally {
      setRefreshing(false);
    }
  }, [cargarDatos]);

  const actualizarRegistro = useCallback((id, data) => {
    setRegistros(prev => 
      prev.map(registro => 
        registro.id === id ? { ...registro, ...data } : registro
      )
    );
  }, []);

  const eliminarRegistro = useCallback((id) => {
    setRegistros(prev => prev.filter(registro => registro.id !== id));
  }, []);

  return {
    registros,
    tiposHora,
    usuarios,
    loading,
    refreshing,
    cargarDatos,
    refrescarDatos,
    actualizarRegistro,
    eliminarRegistro
  };
};
