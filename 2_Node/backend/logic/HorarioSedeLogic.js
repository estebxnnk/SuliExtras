const HorarioSede = require('../models/HorarioSede');
const Sede = require('../models/Sede');
const { Op } = require('sequelize');

class HorarioSedeLogic {
  /**
   * Crear un nuevo horario para una sede
   * @param {Object} data - Datos del horario
   * @returns {Object} - Horario creado
   */
  async crearHorario(data) {
    const { sedeId, nombre, tipo, horaEntrada, horaSalida, tiempoAlmuerzo = 60, diasTrabajados = 5, descripcion } = data;
    
    // Verificar que la sede existe
    const sede = await Sede.findByPk(sedeId);
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    
    // Validar que la hora de salida sea posterior a la de entrada
    if (horaEntrada >= horaSalida) {
      throw new Error('La hora de salida debe ser posterior a la hora de entrada');
    }
    
    // Calcular horas base y reales de la jornada
    const horasBase = this.calcularHorasJornada(horaEntrada, horaSalida);
    const almuerzoHoras = Math.max(0, Number(tiempoAlmuerzo)) / 60;
    const horasReales = parseFloat(Math.max(0, horasBase - almuerzoHoras).toFixed(2));
    
    const horario = await HorarioSede.create({
      sedeId,
      nombre,
      tipo,
      horaEntrada,
      horaSalida,
      horasJornada: horasBase,
      horasJornadaReal: horasReales,
      tiempoAlmuerzo: Math.max(0, Number(tiempoAlmuerzo)),
      diasTrabajados,
      descripcion
    });
    
    return horario;
  }
  
  /**
   * Obtener horarios de una sede
   * @param {number} sedeId - ID de la sede
   * @returns {Array} - Lista de horarios
   */
  async obtenerHorariosPorSede(sedeId) {
    // Verificar que la sede existe
    const sede = await Sede.findByPk(sedeId);
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    
    return await HorarioSede.findAll({
      where: { sedeId },
      order: [['tipo', 'ASC']]
    });
  }
  
  /**
   * Obtener horario específico de una sede por tipo
   * @param {number} sedeId - ID de la sede
   * @param {string} tipo - Tipo de horario
   * @returns {Object} - Horario encontrado
   */
  async obtenerHorarioPorDia(sedeId, tipo = 'normal') {
    const horario = await HorarioSede.findOne({
      where: { sedeId, tipo, activo: true }
    });
    
    if (!horario) {
      throw new Error(`No se encontró horario de tipo '${tipo}' en la sede`);
    }
    
    return horario;
  }
  
  /**
   * Actualizar un horario
   * @param {number} horarioId - ID del horario
   * @param {Object} data - Datos a actualizar
   * @returns {Object} - Horario actualizado
   */
  async actualizarHorario(horarioId, data) {
    const horario = await HorarioSede.findByPk(horarioId);
    
    if (!horario) {
      throw new Error('Horario no encontrado');
    }
    
    // Si se está cambiando el tipo, verificar que no exista conflicto (comentado para permitir múltiples horarios)
    // if (data.tipo && data.tipo !== horario.tipo) {
    //   const horarioExistente = await HorarioSede.findOne({
    //     where: {
    //       sedeId: horario.sedeId,
    //       tipo: data.tipo,
    //       id: { [Op.ne]: horarioId }
    //     }
    //   });
    //   
    //   if (horarioExistente) {
    //     throw new Error(`Ya existe un horario de tipo '${data.tipo}' para esta sede`);
    //   }
    // }
    
    // Validar horas si se están actualizando
    if (data.horaEntrada && data.horaSalida) {
      if (data.horaEntrada >= data.horaSalida) {
        throw new Error('La hora de salida debe ser posterior a la hora de entrada');
      }
    }
    
    // Recalcular horas reales si cambian horas o tiempo de almuerzo
    const nuevaHoraEntrada = data.horaEntrada || horario.horaEntrada;
    const nuevaHoraSalida = data.horaSalida || horario.horaSalida;
    const nuevoTiempoAlmuerzo =
      data.tiempoAlmuerzo !== undefined
        ? Math.max(0, Number(data.tiempoAlmuerzo))
        : (horario.tiempoAlmuerzo || 60);
    
    const horasBase = this.calcularHorasJornada(nuevaHoraEntrada, nuevaHoraSalida);
    const almuerzoHoras = nuevoTiempoAlmuerzo / 60;
    const horasReales = parseFloat(Math.max(0, horasBase - almuerzoHoras).toFixed(2));
    
    await horario.update({
      ...data,
      tiempoAlmuerzo: nuevoTiempoAlmuerzo,
      horasJornada: horasBase,
      horasJornadaReal: horasReales,
    });
    
    return horario;
  }
  
  /**
   * Eliminar un horario
   * @param {number} horarioId - ID del horario
   * @returns {Object} - Resultado de la eliminación
   */
  async eliminarHorario(horarioId) {
    const horario = await HorarioSede.findByPk(horarioId);
    
    if (!horario) {
      throw new Error('Horario no encontrado');
    }
    
    await horario.destroy();
    return { message: 'Horario eliminado exitosamente' };
  }
  
  /**
   * Cambiar estado de un horario (activar/desactivar)
   * @param {number} horarioId - ID del horario
   * @param {boolean} activo - Nuevo estado
   * @returns {Object} - Horario actualizado
   */
  async cambiarEstadoHorario(horarioId, activo) {
    const horario = await HorarioSede.findByPk(horarioId);
    
    if (!horario) {
      throw new Error('Horario no encontrado');
    }
    
    await horario.update({ activo });
    return horario;
  }
  
  /**
   * Crear horarios por defecto para una sede
   * @param {number} sedeId - ID de la sede
   * @param {Object} config - Configuración del horario por defecto
   * @returns {Array} - Horarios creados
   */
  async crearHorariosPorDefecto(sedeId, config = {}) {
    const {
      horaEntrada = '08:00',
      horaSalida = '17:00',
      tiempoAlmuerzo = 60,
      diasTrabajados = 5
    } = config;
    
    // Verificar que la sede existe
    const sede = await Sede.findByPk(sedeId);
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    
    const horariosCreados = [];
    const tiposHorario = ['normal']; // Solo crear horario normal por defecto
    
    for (const tipo of tiposHorario) {
      try {
        const horario = await this.crearHorario({
          sedeId,
          nombre: `Horario ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
          tipo,
          horaEntrada,
          horaSalida,
          tiempoAlmuerzo,
          diasTrabajados,
          descripcion: `Horario por defecto de tipo ${tipo}`
        });
        
        horariosCreados.push(horario);
      } catch (error) {
        // Si ya existe un horario para ese tipo, continuar
        if (error.message.includes('Ya existe un horario')) {
          console.log(`Horario de tipo ${tipo} ya existe, saltando...`);
        } else {
          throw error;
        }
      }
    }
    
    return horariosCreados;
  }
  
  /**
   * Obtener horario completo de una semana para una sede
   * @param {number} sedeId - ID de la sede
   * @returns {Object} - Horarios organizados por tipo
   */
  async obtenerHorarioSemanal(sedeId) {
    const horarios = await this.obtenerHorariosPorSede(sedeId);
    
    const horariosPorTipo = {};
    
    // Organizar horarios por tipo
    horarios.forEach(horario => {
      horariosPorTipo[horario.tipo] = horario;
    });
    
    return horariosPorTipo;
  }
  
  /**
   * Calcular horas de jornada entre dos horas
   * @param {string} horaEntrada - Hora de entrada (HH:mm)
   * @param {string} horaSalida - Hora de salida (HH:mm)
   * @returns {number} - Horas de jornada
   */
  calcularHorasJornada(horaEntrada, horaSalida) {
    const [hE, mE] = horaEntrada.split(':').map(Number);
    const [hS, mS] = horaSalida.split(':').map(Number);
    
    let entradaMinutos = hE * 60 + mE;
    let salidaMinutos = hS * 60 + mS;
    
    // Si la salida es menor que la entrada, significa que trabajó hasta el día siguiente
    if (salidaMinutos < entradaMinutos) {
      salidaMinutos += 24 * 60;
    }
    
    const totalMinutos = salidaMinutos - entradaMinutos;
    return parseFloat((totalMinutos / 60).toFixed(2));
  }
}

module.exports = new HorarioSedeLogic();