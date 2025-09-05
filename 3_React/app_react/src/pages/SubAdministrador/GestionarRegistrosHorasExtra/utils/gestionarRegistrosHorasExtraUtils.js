// Utilidades para el módulo GestionarRegistrosHorasExtra

/**
 * Filtra los registros según los criterios de búsqueda y estado
 * @param {Array} registros - Lista de registros a filtrar
 * @param {string} search - Término de búsqueda
 * @param {string} filtroEstado - Estado por el cual filtrar
 * @returns {Array} - Registros filtrados
 */
export const filtrarRegistros = (registros, search, filtroEstado) => {
  return registros.filter(r => {
    const cumpleBusqueda = 
      (r.usuario && r.usuario.toLowerCase().includes(search.toLowerCase())) ||
      (r.numRegistro && r.numRegistro.toLowerCase().includes(search.toLowerCase())) ||
      (r.ubicacion && r.ubicacion.toLowerCase().includes(search.toLowerCase()));
    
    const cumpleEstado = filtroEstado === 'todos' || r.estado === filtroEstado;
    
    return cumpleBusqueda && cumpleEstado;
  });
};

/**
 * Aplica paginación a los registros filtrados
 * @param {Array} registros - Lista de registros filtrados
 * @param {number} page - Página actual
 * @param {number} rowsPerPage - Filas por página
 * @returns {Array} - Registros paginados
 */
export const paginarRegistros = (registros, page, rowsPerPage) => {
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  return registros.slice(startIndex, endIndex);
};

/**
 * Calcula las horas extra basándose en horarios de entrada y salida
 * @param {string} horaIngreso - Hora de ingreso (formato HH:MM)
 * @param {string} horaSalida - Hora de salida (formato HH:MM)
 * @returns {number} - Horas extra calculadas
 */
export const calcularHorasExtra = (horaIngreso, horaSalida) => {
  if (!horaIngreso || !horaSalida) return 0;
  
  const [horaInicio, minInicio] = horaIngreso.split(':').map(Number);
  const [horaFin, minFin] = horaSalida.split(':').map(Number);
  
  let horasExtra = (horaFin - horaInicio) + (minFin - minInicio) / 60;
  
  // Si las horas son negativas, significa que pasó la medianoche
  if (horasExtra < 0) {
    horasExtra += 24;
  }
  
  // Restar 8 horas de trabajo normal
  horasExtra = Math.max(0, horasExtra - 8);
  
  return Math.round(horasExtra * 100) / 100; // Redondear a 2 decimales
};

/**
 * Genera un número de registro único
 * @returns {string} - Número de registro generado
 */
export const generarNumeroRegistro = () => {
  return `REG-${Date.now()}`;
};

/**
 * Valida que un registro tenga todos los campos requeridos
 * @param {Object} registro - Datos del registro a validar
 * @returns {Object} - Objeto con isValid y errores
 */
export const validarRegistro = (registro) => {
  const errores = [];
  
  if (!registro.fecha) errores.push('La fecha es requerida');
  if (!registro.usuario) errores.push('El empleado es requerido');
  if (!registro.horaIngreso) errores.push('La hora de ingreso es requerida');
  if (!registro.horaSalida) errores.push('La hora de salida es requerida');
  if (!registro.ubicacion) errores.push('La ubicación es requerida');
  if (!registro.cantidadHorasExtra || parseInt(registro.cantidadHorasExtra) < 1) {
    errores.push('Debe ingresar una cantidad válida de horas extra (mínimo 1 hora)');
  }
  if (!registro.tipoHoraId) errores.push('El tipo de hora extra es requerido');
  
  return {
    isValid: errores.length === 0,
    errores
  };
};

/**
 * Formatea la fecha para mostrar en la interfaz
 * @param {string} fecha - Fecha en formato ISO
 * @returns {string} - Fecha formateada
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
 * Formatea la hora para mostrar en la interfaz
 * @param {string} hora - Hora en formato HH:MM
 * @returns {string} - Hora formateada
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
 * Obtiene el nombre completo del empleado
 * @param {Object} usuario - Objeto usuario con datos de persona
 * @returns {string} - Nombre completo del empleado
 */
export const obtenerNombreEmpleado = (usuario) => {
  if (!usuario || !usuario.persona) return 'N/A';
  
  const nombres = usuario.persona.nombres || '';
  const apellidos = usuario.persona.apellidos || '';
  
  return `${nombres} ${apellidos}`.trim() || 'N/A';
};

/**
 * Obtiene el documento del empleado formateado
 * @param {Object} usuario - Objeto usuario con datos de persona
 * @returns {string} - Documento formateado
 */
export const obtenerDocumentoEmpleado = (usuario) => {
  if (!usuario || !usuario.persona) return 'N/A';
  
  const tipoDocumento = usuario.persona.tipoDocumento || '';
  const numeroDocumento = usuario.persona.numeroDocumento || '';
  
  if (tipoDocumento && numeroDocumento) {
    return `${tipoDocumento}: ${numeroDocumento}`;
  }
  
  return 'N/A';
};

/**
 * Verifica si un registro puede ser editado
 * @param {Object} registro - Registro a verificar
 * @returns {boolean} - True si puede ser editado
 */
export const puedeEditarRegistro = (registro) => {
  return registro.estado === 'pendiente';
};

/**
 * Verifica si un registro puede cambiar de estado
 * @param {Object} registro - Registro a verificar
 * @returns {boolean} - True si puede cambiar de estado
 */
export const puedeCambiarEstado = (registro) => {
  return ['pendiente', 'aprobado', 'rechazado'].includes(registro.estado);
};

/**
 * Obtiene las acciones disponibles para un registro según su estado
 * @param {Object} registro - Registro a verificar
 * @returns {Array} - Lista de acciones disponibles
 */
export const obtenerAccionesDisponibles = (registro) => {
  const acciones = ['ver', 'editar', 'eliminar'];
  
  if (registro.estado === 'pendiente') {
    acciones.push('aprobar', 'rechazar');
  }
  
  return acciones;
}; 