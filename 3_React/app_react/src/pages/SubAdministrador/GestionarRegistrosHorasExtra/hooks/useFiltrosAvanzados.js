import { useState, useCallback, useMemo } from 'react';

export const useFiltrosAvanzados = (registros = []) => {
  const [filtros, setFiltros] = useState({
    search: '',
    tipoHoraId: '',
    fechaInicio: '',
    fechaFin: '',
    estado: ''
  });

  // Actualizar un filtro específico
  const actualizarFiltro = useCallback((campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  }, []);

  // Limpiar todos los filtros
  const limpiarFiltros = useCallback(() => {
    setFiltros({
      search: '',
      tipoHoraId: '',
      fechaInicio: '',
      fechaFin: '',
      estado: ''
    });
  }, []);

  // Aplicar filtros a los registros
  const registrosFiltrados = useMemo(() => {
    return registros.filter(registro => {
      // Filtro de búsqueda
      if (filtros.search) {
        const searchLower = filtros.search.toLowerCase();
        const matchSearch = 
          (registro.usuario && registro.usuario.toLowerCase().includes(searchLower)) ||
          (registro.nombres && registro.nombres.toLowerCase().includes(searchLower)) ||
          (registro.apellidos && registro.apellidos.toLowerCase().includes(searchLower)) ||
          (registro.ubicacion && registro.ubicacion.toLowerCase().includes(searchLower)) ||
          (registro.numRegistro && registro.numRegistro.toLowerCase().includes(searchLower));
        
        if (!matchSearch) return false;
      }

      // Filtro por tipo de hora (verificar en registro.Horas)
      if (filtros.tipoHoraId) {
        const tieneTipoHora = registro.Horas && registro.Horas.some(hora => hora.id === filtros.tipoHoraId);
        if (!tieneTipoHora) return false;
      }

      // Filtro por estado
      if (filtros.estado) {
        if (registro.estado !== filtros.estado) return false;
      }

      // Filtro por fecha de inicio
      if (filtros.fechaInicio) {
        const fechaRegistro = new Date(registro.fecha);
        const fechaInicio = new Date(filtros.fechaInicio);
        if (fechaRegistro < fechaInicio) return false;
      }

      // Filtro por fecha de fin
      if (filtros.fechaFin) {
        const fechaRegistro = new Date(registro.fecha);
        const fechaFin = new Date(filtros.fechaFin);
        if (fechaRegistro > fechaFin) return false;
      }

      return true;
    });
  }, [registros, filtros]);

  // Obtener estadísticas de filtros
  const estadisticasFiltros = useMemo(() => {
    const totalRegistros = registros.length;
    const registrosFiltradosCount = registrosFiltrados.length;
    const filtrosActivos = Object.values(filtros).filter(valor => valor !== '').length;

    return {
      totalRegistros,
      registrosFiltradosCount,
      filtrosActivos,
      porcentajeFiltrado: totalRegistros > 0 ? ((totalRegistros - registrosFiltradosCount) / totalRegistros * 100).toFixed(1) : 0
    };
  }, [registros, registrosFiltrados, filtros]);

  // Verificar si hay filtros activos
  const hayFiltrosActivos = useMemo(() => {
    return Object.values(filtros).some(valor => valor !== '');
  }, [filtros]);

  // Obtener resumen de filtros aplicados
  const resumenFiltros = useMemo(() => {
    const resumen = [];
    
    if (filtros.search) {
      resumen.push(`Búsqueda: "${filtros.search}"`);
    }
    
    if (filtros.tipoHoraId) {
      resumen.push(`Tipo de hora: ${filtros.tipoHoraId}`);
    }

    if (filtros.estado) {
      resumen.push(`Estado: ${filtros.estado}`);
    }
    
    if (filtros.fechaInicio) {
      resumen.push(`Desde: ${filtros.fechaInicio}`);
    }
    
    if (filtros.fechaFin) {
      resumen.push(`Hasta: ${filtros.fechaFin}`);
    }
    
    return resumen;
  }, [filtros]);

  return {
    // Estado
    filtros,
    
    // Datos filtrados
    registrosFiltrados,
    
    // Funciones
    actualizarFiltro,
    limpiarFiltros,
    
    // Información
    estadisticasFiltros,
    hayFiltrosActivos,
    resumenFiltros
  };
};
