import { useState, useMemo } from 'react';

export const useFiltrosAvanzados = (registros) => {
  const [filtros, setFiltros] = useState({
    search: '',
    tipoHoraId: 'todos',
    fechaInicio: '',
    fechaFin: '',
    estado: 'todos',
    ubicacion: ''
  });

  const registrosFiltrados = useMemo(() => {
    return registros.filter(registro => {
      // Filtro de búsqueda general
      if (filtros.search) {
        const searchTerm = filtros.search.toLowerCase();
        const ubicacion = registro.ubicacion?.toLowerCase() || '';
        const nombres = `${registro.nombres || ''} ${registro.apellidos || ''}`.toLowerCase();
        
        if (!ubicacion.includes(searchTerm) && !nombres.includes(searchTerm)) {
          return false;
        }
      }

      // Filtro por tipo de hora
      if (filtros.tipoHoraId && filtros.tipoHoraId !== 'todos') {
        // Buscar en el array de Horas del registro
        if (!registro.Horas || !registro.Horas.some(h => h.id === parseInt(filtros.tipoHoraId))) {
          return false;
        }
      }

      // Filtro por fecha
      if (filtros.fechaInicio || filtros.fechaFin) {
        const fechaRegistro = new Date(registro.fecha);
        if (filtros.fechaInicio && fechaRegistro < new Date(filtros.fechaInicio)) {
          return false;
        }
        if (filtros.fechaFin && fechaRegistro > new Date(filtros.fechaFin)) {
          return false;
        }
      }

      // Filtro por estado
      if (filtros.estado && filtros.estado !== 'todos' && registro.estado !== filtros.estado) {
        return false;
      }

      // Filtro por ubicación
      if (filtros.ubicacion && !registro.ubicacion?.toLowerCase().includes(filtros.ubicacion.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [registros, filtros]);

  const estadisticasFiltros = useMemo(() => {
    const total = registros.length;
    const filtrados = registrosFiltrados.length;
    const ocultados = total - filtrados;
    const porcentajeFiltrado = total > 0 ? Math.round((ocultados / total) * 100) : 0;
    const filtrosActivos = Object.values(filtros).filter(valor => valor !== '').length;

    return {
      total,
      filtrados,
      ocultados,
      porcentajeFiltrado,
      filtrosActivos
    };
  }, [registros, registrosFiltrados, filtros]);

  const hayFiltrosActivos = Object.entries(filtros).some(([key, valor]) => {
    if (key === 'tipoHoraId' || key === 'estado') {
      return valor !== 'todos' && valor !== '';
    }
    return valor !== '';
  });

  const actualizarFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      search: '',
      tipoHoraId: 'todos',
      fechaInicio: '',
      fechaFin: '',
      estado: 'todos',
      ubicacion: ''
    });
  };

  return {
    filtros,
    registrosFiltrados,
    estadisticasFiltros,
    hayFiltrosActivos,
    actualizarFiltro,
    limpiarFiltros
  };
};
