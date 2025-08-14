const horarioSedeLogic = require('../logic/HorarioSedeLogic');

/**
 * Crear un nuevo horario para una sede
 */
const crearHorario = async (req, res) => {
  try {
    const { sedeId, nombre, tipo, diaSemana, horaEntrada, horaSalida, tiempoAlmuerzo, diasTrabajados, descripcion } = req.body;
    
    // Validaciones básicas
    if (!sedeId || !nombre || !diaSemana || !horaEntrada || !horaSalida) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: sedeId, nombre, diaSemana, horaEntrada, horaSalida'
      });
    }
    
    // Validar formato de hora
    const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horaRegex.test(horaEntrada) || !horaRegex.test(horaSalida)) {
      return res.status(400).json({
        error: 'Formato de hora inválido. Use HH:mm'
      });
    }
    
    // Validar día de la semana
    if (diaSemana < 0 || diaSemana > 6) {
      return res.status(400).json({
        error: 'Día de la semana debe estar entre 0 (Domingo) y 6 (Sábado)'
      });
    }
    
    // Validar tiempo de almuerzo si viene
    if (tiempoAlmuerzo !== undefined) {
      const ta = Number(tiempoAlmuerzo);
      if (Number.isNaN(ta) || ta < 0 || ta > 180) {
        return res.status(400).json({ error: 'tiempoAlmuerzo debe estar entre 0 y 180 minutos' });
      }
    }
    
    // Validar diasTrabajados si viene
    if (diasTrabajados !== undefined) {
      const dt = Number(diasTrabajados);
      if (Number.isNaN(dt) || dt < 0 || dt > 7) {
        return res.status(400).json({ error: 'diasTrabajados debe estar entre 0 y 7' });
      }
    }
    
    const horario = await horarioSedeLogic.crearHorario({
      sedeId,
      nombre,
      tipo: tipo || 'normal',
      diaSemana,
      horaEntrada,
      horaSalida,
      tiempoAlmuerzo,
      diasTrabajados,
      descripcion
    });
    
    res.status(201).json({
      message: 'Horario creado exitosamente',
      horario
    });
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtener horarios de una sede
 */
const obtenerHorariosPorSede = async (req, res) => {
  try {
    const { sedeId } = req.params;
    
    if (!sedeId) {
      return res.status(400).json({
        error: 'ID de sede requerido'
      });
    }
    
    const horarios = await horarioSedeLogic.obtenerHorariosPorSede(sedeId);
    res.status(200).json(horarios);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(404).json({ error: error.message });
  }
};

/**
 * Obtener horario semanal de una sede
 */
const obtenerHorarioSemanal = async (req, res) => {
  try {
    const { sedeId } = req.params;
    
    if (!sedeId) {
      return res.status(400).json({
        error: 'ID de sede requerido'
      });
    }
    
    const horarioSemanal = await horarioSedeLogic.obtenerHorarioSemanal(sedeId);
    res.status(200).json(horarioSemanal);
  } catch (error) {
    console.error('Error al obtener horario semanal:', error);
    res.status(404).json({ error: error.message });
  }
};

/**
 * Obtener horario específico por día
 */
const obtenerHorarioPorDia = async (req, res) => {
  try {
    const { sedeId, diaSemana } = req.params;
    const { tipo } = req.query;
    
    if (!sedeId || diaSemana === undefined) {
      return res.status(400).json({
        error: 'ID de sede y día de la semana son requeridos'
      });
    }
    
    const dia = parseInt(diaSemana);
    if (isNaN(dia) || dia < 0 || dia > 6) {
      return res.status(400).json({
        error: 'Día de la semana debe estar entre 0 y 6'
      });
    }
    
    const horario = await horarioSedeLogic.obtenerHorarioPorDia(sedeId, dia, tipo);
    res.status(200).json(horario);
  } catch (error) {
    console.error('Error al obtener horario por día:', error);
    res.status(404).json({ error: error.message });
  }
};

/**
 * Actualizar un horario
 */
const actualizarHorario = async (req, res) => {
  try {
    const { horarioId } = req.params;
    const datosActualizacion = req.body;
    
    if (!horarioId) {
      return res.status(400).json({
        error: 'ID de horario requerido'
      });
    }
    
    // Validar formato de hora si se están actualizando
    if (datosActualizacion.horaEntrada || datosActualizacion.horaSalida) {
      const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (datosActualizacion.horaEntrada && !horaRegex.test(datosActualizacion.horaEntrada)) {
        return res.status(400).json({
          error: 'Formato de hora de entrada inválido. Use HH:mm'
        });
      }
      if (datosActualizacion.horaSalida && !horaRegex.test(datosActualizacion.horaSalida)) {
        return res.status(400).json({
          error: 'Formato de hora de salida inválido. Use HH:mm'
        });
      }
    }
    
    // Validar tiempoAlmuerzo si viene
    if (datosActualizacion.tiempoAlmuerzo !== undefined) {
      const ta = Number(datosActualizacion.tiempoAlmuerzo);
      if (Number.isNaN(ta) || ta < 0 || ta > 180) {
        return res.status(400).json({ error: 'tiempoAlmuerzo debe estar entre 0 y 180 minutos' });
      }
    }
    
    // Validar diasTrabajados si viene
    if (datosActualizacion.diasTrabajados !== undefined) {
      const dt = Number(datosActualizacion.diasTrabajados);
      if (Number.isNaN(dt) || dt < 0 || dt > 7) {
        return res.status(400).json({ error: 'diasTrabajados debe estar entre 0 y 7' });
      }
    }
    
    const horario = await horarioSedeLogic.actualizarHorario(horarioId, datosActualizacion);
    
    res.status(200).json({
      message: 'Horario actualizado exitosamente',
      horario
    });
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Eliminar un horario
 */
const eliminarHorario = async (req, res) => {
  try {
    const { horarioId } = req.params;
    
    if (!horarioId) {
      return res.status(400).json({
        error: 'ID de horario requerido'
      });
    }
    
    const resultado = await horarioSedeLogic.eliminarHorario(horarioId);
    
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cambiar estado de un horario
 */
const cambiarEstadoHorario = async (req, res) => {
  try {
    const { horarioId } = req.params;
    const { activo } = req.body;
    
    if (!horarioId) {
      return res.status(400).json({
        error: 'ID de horario requerido'
      });
    }
    
    if (typeof activo !== 'boolean') {
      return res.status(400).json({
        error: 'El campo activo debe ser un valor booleano'
      });
    }
    
    const horario = await horarioSedeLogic.cambiarEstadoHorario(horarioId, activo);
    
    res.status(200).json({
      message: `Horario ${activo ? 'activado' : 'desactivado'} exitosamente`,
      horario
    });
  } catch (error) {
    console.error('Error al cambiar estado de horario:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Crear horarios por defecto para una sede
 */
const crearHorariosPorDefecto = async (req, res) => {
  try {
    const { sedeId } = req.params;
    const config = req.body;
    
    if (!sedeId) {
      return res.status(400).json({
        error: 'ID de sede requerido'
      });
    }
    
    // Validaciones opcionales de config
    if (config?.tiempoAlmuerzo !== undefined) {
      const ta = Number(config.tiempoAlmuerzo);
      if (Number.isNaN(ta) || ta < 0 || ta > 180) {
        return res.status(400).json({ error: 'tiempoAlmuerzo debe estar entre 0 y 180 minutos' });
      }
    }
    if (config?.diasTrabajados !== undefined) {
      const dt = Number(config.diasTrabajados);
      if (Number.isNaN(dt) || dt < 0 || dt > 7) {
        return res.status(400).json({ error: 'diasTrabajados debe estar entre 0 y 7' });
      }
    }
    
    const horariosCreados = await horarioSedeLogic.crearHorariosPorDefecto(sedeId, config);
    
    res.status(201).json({
      message: 'Horarios por defecto creados exitosamente',
      horariosCreados,
      total: horariosCreados.length
    });
  } catch (error) {
    console.error('Error al crear horarios por defecto:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  crearHorario,
  obtenerHorariosPorSede,
  obtenerHorarioSemanal,
  obtenerHorarioPorDia,
  actualizarHorario,
  eliminarHorario,
  cambiarEstadoHorario,
  crearHorariosPorDefecto
}; 