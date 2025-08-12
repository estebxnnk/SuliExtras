const horasTrabajadasLogic = require('../logic/HorasTrabajadasLogic');

/**
 * Registra las horas trabajadas de un empleado
 */
const registrarHoras = async (req, res) => {
  try {
    const { fecha, horaEntrada, horaSalida, observaciones } = req.body;
    const usuarioId = req.userInfo.id; // Usar el ID del usuario autenticado
    
    // Validaciones básicas
    if (!fecha || !horaEntrada || !horaSalida) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: fecha, horaEntrada, horaSalida'
      });
    }
    
    // Validar formato de hora (HH:mm)
    const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horaRegex.test(horaEntrada) || !horaRegex.test(horaSalida)) {
      return res.status(400).json({
        error: 'Formato de hora inválido. Use HH:mm (ejemplo: 08:30)'
      });
    }
    
    // Validar que la fecha sea válida
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
      return res.status(400).json({
        error: 'Fecha inválida'
      });
    }
    
    const registro = await horasTrabajadasLogic.registrarHoras({
      usuarioId,
      fecha,
      horaEntrada,
      horaSalida,
      observaciones
    });
    
    res.status(201).json({
      message: 'Registro de horas creado exitosamente',
      registro
    });
  } catch (error) {
    console.error('Error al registrar horas:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtiene todos los registros de horas trabajadas
 */
const listarRegistros = async (req, res) => {
  try {
    const registros = await horasTrabajadasLogic.listarRegistros();
    res.status(200).json(registros);
  } catch (error) {
    console.error('Error al listar registros:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene los registros de un usuario específico
 */
const obtenerRegistrosPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    if (!usuarioId) {
      return res.status(400).json({
        error: 'ID de usuario requerido'
      });
    }
    
    const registros = await horasTrabajadasLogic.obtenerRegistrosPorUsuario(usuarioId);
    res.status(200).json(registros);
  } catch (error) {
    console.error('Error al obtener registros del usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualiza el estado de un registro (aprobación/rechazo)
 */
const actualizarEstado = async (req, res) => {
  try {
    const { registroId } = req.params;
    const { estado, observaciones } = req.body;
    
    if (!registroId || !estado) {
      return res.status(400).json({
        error: 'ID de registro y estado son requeridos'
      });
    }
    
    if (!['pendiente', 'aprobado', 'rechazado'].includes(estado)) {
      return res.status(400).json({
        error: 'Estado no válido. Debe ser: pendiente, aprobado o rechazado'
      });
    }
    
    const registro = await horasTrabajadasLogic.actualizarEstado(registroId, estado, observaciones);
    
    res.status(200).json({
      message: 'Estado actualizado exitosamente',
      registro
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtiene estadísticas de horas extra por usuario
 */
const obtenerEstadisticas = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { fechaInicio, fechaFin } = req.query;
    
    if (!usuarioId) {
      return res.status(400).json({
        error: 'ID de usuario requerido'
      });
    }
    
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Fechas de inicio y fin son requeridas'
      });
    }
    
    // Validar formato de fecha (YYYY-MM-DD)
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
      return res.status(400).json({
        error: 'Formato de fecha inválido. Use YYYY-MM-DD'
      });
    }
    
    const estadisticas = await horasTrabajadasLogic.obtenerEstadisticas(
      usuarioId,
      fechaInicio,
      fechaFin
    );
    
    res.status(200).json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Calcula horas extra sin guardar (para pruebas)
 */
const calcularHorasExtra = async (req, res) => {
  try {
    const { horaEntrada, horaSalida } = req.body;
    
    if (!horaEntrada || !horaSalida) {
      return res.status(400).json({
        error: 'Hora de entrada y salida son requeridas'
      });
    }
    
    // Validar formato de hora
    const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horaRegex.test(horaEntrada) || !horaRegex.test(horaSalida)) {
      return res.status(400).json({
        error: 'Formato de hora inválido. Use HH:mm'
      });
    }
    
    const calculo = horasTrabajadasLogic.calcularHorasExtra(horaEntrada, horaSalida);
    
    res.status(200).json({
      horaEntrada,
      horaSalida,
      ...calculo
    });
  } catch (error) {
    console.error('Error al calcular horas extra:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registrarHoras,
  listarRegistros,
  obtenerRegistrosPorUsuario,
  actualizarEstado,
  obtenerEstadisticas,
  calcularHorasExtra
}; 