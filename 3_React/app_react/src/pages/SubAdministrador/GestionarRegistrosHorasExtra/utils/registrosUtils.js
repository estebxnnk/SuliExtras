/**
 * Utilidades para la gestión de registros de horas extra
 * Funciones auxiliares para cálculos, formateo y validaciones
 */

/**
 * Obtiene la configuración del chip de estado para un registro
 * @param {string} estado - Estado del registro (pendiente, aprobado, rechazado)
 * @returns {Object} Configuración del chip con color, icono y label
 */
export const getEstadoChip = (estado) => {
  const estados = {
    pendiente: { 
      color: 'warning', 
      label: 'Pendiente',
      bgColor: '#fff3cd',
      textColor: '#856404',
      borderColor: '#ffeaa7'
    },
    aprobado: { 
      color: 'success', 
      label: 'Aprobado',
      bgColor: '#d4edda',
      textColor: '#155724',
      borderColor: '#c3e6cb'
    },
    rechazado: { 
      color: 'error', 
      label: 'Rechazado',
      bgColor: '#f8d7da',
      textColor: '#721c24',
      borderColor: '#f5c6cb'
    }
  };
  
  return estados[estado] || estados.pendiente;
};

/**
 * Obtiene el nombre del tipo de hora extra para un registro
 * @param {Object} registro - Registro de horas extra
 * @returns {string} Nombre del tipo de hora extra
 */
export const getTipoHoraNombre = (registro) => {
  if (!registro.Horas || registro.Horas.length === 0) {
    return 'No asignado';
  }
  
  // Si hay múltiples tipos de hora, mostrar el primero
  const primerTipo = registro.Horas[0];
  return `${primerTipo.tipo} - ${primerTipo.denominacion}`;
};

/**
 * Obtiene la información del usuario para un registro
 * @param {string} usuarioId - ID o email del usuario
 * @param {Array} usuarios - Lista de usuarios disponibles
 * @returns {Object|null} Información del usuario o null si no se encuentra
 */
export const getUsuario = (usuarioId, usuarios) => {
  if (!usuarioId || !usuarios || usuarios.length === 0) {
    return null;
  }
  
  // Buscar por email primero
  let usuario = usuarios.find(u => u.email === usuarioId);
  
  // Si no se encuentra por email, buscar por ID
  if (!usuario) {
    usuario = usuarios.find(u => u.id === usuarioId);
  }
  
  return usuario;
};

/**
 * Calcula las estadísticas generales de los registros
 * @param {Array} registros - Lista completa de registros
 * @param {Array} registrosFiltrados - Lista de registros filtrados
 * @param {Object} estadisticasFiltros - Estadísticas de los filtros aplicados
 * @returns {Object} Estadísticas calculadas
 */
export const calcularEstadisticas = (registros, registrosFiltrados, estadisticasFiltros) => {
  const totalRegistros = registros.length;
  const registrosFiltradosCount = registrosFiltrados.length;
  
  // Contar registros por estado
  const registrosPendientes = registros.filter(r => r.estado === 'pendiente').length;
  const registrosAprobados = registros.filter(r => r.estado === 'aprobado').length;
  const registrosRechazados = registros.filter(r => r.estado === 'rechazado').length;
  
  // Contar tipos de hora únicos
  const tiposHoraUnicos = new Set();
  registros.forEach(registro => {
    if (registro.Horas && registro.Horas.length > 0) {
      registro.Horas.forEach(hora => {
        tiposHoraUnicos.add(hora.tipo);
      });
    }
  });
  const tiposHoraCount = tiposHoraUnicos.size;
  
  // Calcular porcentaje de filtrado
  const porcentajeFiltrado = totalRegistros > 0 
    ? Math.round(((totalRegistros - registrosFiltradosCount) / totalRegistros) * 100)
    : 0;
  
  return {
    totalRegistros,
    registrosFiltrados: registrosFiltradosCount,
    registrosPendientes,
    registrosAprobados,
    registrosRechazados,
    tiposHoraCount,
    porcentajeFiltrado
  };
};

/**
 * Formatea una fecha para mostrar en la interfaz
 * @param {string} fecha - Fecha en formato ISO o string
 * @returns {string} Fecha formateada
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  
  try {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return fecha;
  }
};

/**
 * Formatea una hora para mostrar en la interfaz
 * @param {string} hora - Hora en formato HH:MM
 * @returns {string} Hora formateada
 */
export const formatearHora = (hora) => {
  if (!hora) return 'N/A';
  
  try {
    const [horas, minutos] = hora.split(':');
    return `${horas}:${minutos}`;
  } catch (error) {
    return hora;
  }
};

/**
 * Calcula la duración entre dos horas
 * @param {string} horaInicio - Hora de inicio en formato HH:MM
 * @param {string} horaFin - Hora de fin en formato HH:MM
 * @returns {number} Duración en horas (decimal)
 */
export const calcularDuracion = (horaInicio, horaFin) => {
  if (!horaInicio || !horaFin) return 0;
  
  try {
    const [horaIni, minIni] = horaInicio.split(':').map(Number);
    const [horaFinNum, minFin] = horaFin.split(':').map(Number);
    
    let duracion = (horaFinNum - horaIni) + (minFin - minIni) / 60;
    
    // Si las horas son negativas, significa que pasó la medianoche
    if (duracion < 0) {
      duracion += 24;
    }
    
    return Math.max(0, duracion);
  } catch (error) {
    return 0;
  }
};

/**
 * Valida si un registro de horas extra es válido
 * @param {Object} registro - Registro a validar
 * @returns {Object} Resultado de la validación
 */
export const validarRegistro = (registro) => {
  const errores = [];
  
  if (!registro.fecha) {
    errores.push('La fecha es obligatoria');
  }
  
  if (!registro.horaIngreso) {
    errores.push('La hora de ingreso es obligatoria');
  }
  
  if (!registro.horaSalida) {
    errores.push('La hora de salida es obligatoria');
  }
  
  if (!registro.ubicacion) {
    errores.push('La ubicación es obligatoria');
  }
  
  if (!registro.usuario) {
    errores.push('El usuario es obligatorio');
  }
  
  if (!registro.cantidadHorasExtra || registro.cantidadHorasExtra <= 0) {
    errores.push('La cantidad de horas extra debe ser mayor a 0');
  }
  
  if (!registro.tipoHoraId) {
    errores.push('El tipo de hora extra es obligatorio');
  }
  
  const esValido = errores.length === 0;
  
  return {
    esValido,
    errores
  };
};

/**
 * Filtra registros por múltiples criterios
 * @param {Array} registros - Lista de registros a filtrar
 * @param {Object} filtros - Objeto con los filtros a aplicar
 * @returns {Array} Registros filtrados
 */
export const filtrarRegistros = (registros, filtros) => {
  if (!registros || registros.length === 0) return [];
  
  return registros.filter(registro => {
    // Filtro por estado
    if (filtros.estado && filtros.estado !== 'todos') {
      if (registro.estado !== filtros.estado) return false;
    }
    
    // Filtro por fecha
    if (filtros.fechaInicio) {
      const fechaRegistro = new Date(registro.fecha);
      const fechaInicio = new Date(filtros.fechaInicio);
      if (fechaRegistro < fechaInicio) return false;
    }
    
    if (filtros.fechaFin) {
      const fechaRegistro = new Date(registro.fecha);
      const fechaFin = new Date(filtros.fechaFin);
      if (fechaRegistro > fechaFin) return false;
    }
    
    // Filtro por usuario
    if (filtros.usuario && filtros.usuario !== 'todos') {
      if (registro.usuario !== filtros.usuario) return false;
    }
    
    // Filtro por ubicación
    if (filtros.ubicacion && filtros.ubicacion !== 'todas') {
      if (registro.ubicacion !== filtros.ubicacion) return false;
    }
    
    // Filtro por tipo de hora
    if (filtros.tipoHoraId && filtros.tipoHoraId !== 'todos') {
      // Buscar en el array de Horas del registro
      if (!registro.Horas || !registro.Horas.some(h => h.id === parseInt(filtros.tipoHoraId))) {
        return false;
      }
    }
    
    // Filtro por texto de búsqueda
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      const textoRegistro = `${registro.numRegistro || ''} ${registro.ubicacion || ''}`.toLowerCase();
      if (!textoRegistro.includes(busqueda)) return false;
    }
    
    return true;
  });
};

/**
 * Ordena registros por un campo específico
 * @param {Array} registros - Lista de registros a ordenar
 * @param {string} campo - Campo por el cual ordenar
 * @param {string} direccion - Dirección del ordenamiento (asc, desc)
 * @returns {Array} Registros ordenados
 */
export const ordenarRegistros = (registros, campo = 'fecha', direccion = 'desc') => {
  if (!registros || registros.length === 0) return [];
  
  const registrosOrdenados = [...registros];
  
  registrosOrdenados.sort((a, b) => {
    let valorA, valorB;
    
    switch (campo) {
      case 'fecha':
        valorA = new Date(a.fecha);
        valorB = new Date(b.fecha);
        break;
      case 'cantidadHorasExtra':
        valorA = parseFloat(a.cantidadHorasExtra) || 0;
        valorB = parseFloat(b.cantidadHorasExtra) || 0;
        break;
      case 'estado':
        valorA = a.estado || '';
        valorB = b.estado || '';
        break;
      case 'usuario':
        valorA = a.usuario || '';
        valorB = b.usuario || '';
        break;
      case 'ubicacion':
        valorA = a.ubicacion || '';
        valorB = b.ubicacion || '';
        break;
      default:
        valorA = a[campo] || '';
        valorB = b[campo] || '';
    }
    
    if (direccion === 'asc') {
      return valorA > valorB ? 1 : -1;
    } else {
      return valorA < valorB ? 1 : -1;
    }
  });
  
  return registrosOrdenados;
};

/**
 * Genera un número de registro único
 * @param {Array} registros - Lista de registros existentes
 * @returns {string} Número de registro único
 */
export const generarNumeroRegistro = (registros) => {
  if (!registros || registros.length === 0) {
    return 'REG-001';
  }
  
  const numeros = registros
    .map(r => r.numRegistro)
    .filter(num => num && num.startsWith('REG-'))
    .map(num => parseInt(num.replace('REG-', '')))
    .filter(num => !isNaN(num));
  
  const siguienteNumero = Math.max(...numeros, 0) + 1;
  return `REG-${siguienteNumero.toString().padStart(3, '0')}`;
};

/**
 * Calcula el total de horas extra por usuario en un período
 * @param {Array} registros - Lista de registros
 * @param {string} usuarioId - ID del usuario
 * @param {string} fechaInicio - Fecha de inicio del período
 * @param {string} fechaFin - Fecha de fin del período
 * @returns {number} Total de horas extra
 */
export const calcularHorasExtraUsuario = (registros, usuarioId, fechaInicio, fechaFin) => {
  if (!registros || !usuarioId) return 0;
  
  const registrosUsuario = registros.filter(registro => {
    if (registro.usuario !== usuarioId) return false;
    
    if (fechaInicio) {
      const fechaRegistro = new Date(registro.fecha);
      const fechaIni = new Date(fechaInicio);
      if (fechaRegistro < fechaIni) return false;
    }
    
    if (fechaFin) {
      const fechaRegistro = new Date(registro.fecha);
      const fechaFinObj = new Date(fechaFin);
      if (fechaRegistro > fechaFinObj) return false;
    }
    
    return true;
  });
  
  return registrosUsuario.reduce((total, registro) => {
    return total + (parseFloat(registro.cantidadHorasExtra) || 0);
  }, 0);
};

/**
 * Exporta registros a formato CSV
 * @param {Array} registros - Lista de registros a exportar
 * @param {Array} usuarios - Lista de usuarios para obtener nombres
 * @returns {string} Contenido CSV
 */
export const exportarRegistrosCSV = (registros, usuarios) => {
  if (!registros || registros.length === 0) return '';
  
  const headers = [
    'Número de Registro',
    'Empleado',
    'Fecha',
    'Hora Ingreso',
    'Hora Salida',
    'Horas Extra',
    'Ubicación',
    'Estado',
    'Tipo de Hora',
    'Justificación'
  ];
  
  const rows = registros.map(registro => {
    const usuario = getUsuario(registro.usuario, usuarios);
    const nombreCompleto = usuario?.persona 
      ? `${usuario.persona.nombres} ${usuario.persona.apellidos}`
      : registro.usuario;
    
    return [
      registro.numRegistro || '',
      nombreCompleto,
      registro.fecha || '',
      registro.horaIngreso || '',
      registro.horaSalida || '',
      registro.cantidadHorasExtra || '',
      registro.ubicacion || '',
      registro.estado || '',
      getTipoHoraNombre(registro),
      registro.justificacionHoraExtra || ''
    ];
  });
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
};
