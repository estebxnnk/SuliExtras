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
    const { sedeId, nombre, tipo, diaSemana, horaEntrada, horaSalida, horasJornada, toleranciaEntrada, toleranciaSalida, descripcion } = data;
    
    // Verificar que la sede existe
    const sede = await Sede.findByPk(sedeId);
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    
    // Verificar que no exista un horario para el mismo día y tipo
    const horarioExistente = await HorarioSede.findOne({
      where: { sedeId, diaSemana, tipo }
    });
    
    if (horarioExistente) {
      throw new Error(`Ya existe un horario de tipo '${tipo}' para el día ${this.obtenerNombreDia(diaSemana)}`);
    }
    
    // Validar que la hora de salida sea posterior a la de entrada
    if (horaEntrada >= horaSalida) {
      throw new Error('La hora de salida debe ser posterior a la hora de entrada');
    }
    
    // Calcular horas de jornada si no se proporciona
    const horasCalculadas = horasJornada || this.calcularHorasJornada(horaEntrada, horaSalida);
    
    const horario = await HorarioSede.create({
      sedeId,
      nombre,
      tipo,
      diaSemana,
      horaEntrada,
      horaSalida,
      horasJornada: horasCalculadas,
      toleranciaEntrada: toleranciaEntrada || 15,
      toleranciaSalida: toleranciaSalida || 15,
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
      order: [['diaSemana', 'ASC'], ['tipo', 'ASC']]
    });
  }
  
  /**
   * Obtener horario específico de una sede para un día
   * @param {number} sedeId - ID de la sede
   * @param {number} diaSemana - Día de la semana (0-6)
   * @param {string} tipo - Tipo de horario
   * @returns {Object} - Horario encontrado
   */
  async obtenerHorarioPorDia(sedeId, diaSemana, tipo = 'normal') {
    const horario = await HorarioSede.findOne({
      where: { sedeId, diaSemana, tipo, activo: true }
    });
    
    if (!horario) {
      throw new Error(`No se encontró horario para el día ${this.obtenerNombreDia(diaSemana)} en la sede`);
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
    
    // Si se está cambiando el día o tipo, verificar que no exista conflicto
    if ((data.diaSemana && data.diaSemana !== horario.diaSemana) || 
        (data.tipo && data.tipo !== horario.tipo)) {
      const horarioExistente = await HorarioSede.findOne({
        where: {
          sedeId: horario.sedeId,
          diaSemana: data.diaSemana || horario.diaSemana,
          tipo: data.tipo || horario.tipo,
          id: { [Op.ne]: horarioId }
        }
      });
      
      if (horarioExistente) {
        throw new Error(`Ya existe un horario para el día ${this.obtenerNombreDia(data.diaSemana || horario.diaSemana)}`);
      }
    }
    
    // Validar horas si se están actualizando
    if (data.horaEntrada && data.horaSalida) {
      if (data.horaEntrada >= data.horaSalida) {
        throw new Error('La hora de salida debe ser posterior a la hora de entrada');
      }
      
      // Recalcular horas de jornada
      data.horasJornada = this.calcularHorasJornada(data.horaEntrada, data.horaSalida);
    }
    
    await horario.update(data);
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
   * Crear horarios por defecto para una sede (lunes a viernes, 8 horas)
   * @param {number} sedeId - ID de la sede
   * @param {Object} config - Configuración del horario por defecto
   * @returns {Array} - Horarios creados
   */
  async crearHorariosPorDefecto(sedeId, config = {}) {
    const {
      horaEntrada = '08:00',
      horaSalida = '17:00',
      horasJornada = 8,
      toleranciaEntrada = 15,
      toleranciaSalida = 15
    } = config;
    
    // Verificar que la sede existe
    const sede = await Sede.findByPk(sedeId);
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    
    const horariosCreados = [];
    const diasSemana = [1, 2, 3, 4, 5]; // Lunes a viernes
    
    for (const dia of diasSemana) {
      try {
        const horario = await this.crearHorario({
          sedeId,
          nombre: `Horario ${this.obtenerNombreDia(dia)}`,
          tipo: 'normal',
          diaSemana: dia,
          horaEntrada,
          horaSalida,
          horasJornada,
          toleranciaEntrada,
          toleranciaSalida,
          descripcion: `Horario por defecto para ${this.obtenerNombreDia(dia)}`
        });
        
        horariosCreados.push(horario);
      } catch (error) {
        // Si ya existe un horario para ese día, continuar
        if (error.message.includes('Ya existe un horario')) {
          console.log(`Horario para ${this.obtenerNombreDia(dia)} ya existe, saltando...`);
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
   * @returns {Object} - Horarios organizados por día
   */
  async obtenerHorarioSemanal(sedeId) {
    const horarios = await this.obtenerHorariosPorSede(sedeId);
    
    const horarioSemanal = {};
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    // Inicializar estructura
    dias.forEach((dia, index) => {
      horarioSemanal[dia] = {
        diaSemana: index,
        horarios: []
      };
    });
    
    // Organizar horarios por día
    horarios.forEach(horario => {
      const nombreDia = this.obtenerNombreDia(horario.diaSemana);
      horarioSemanal[nombreDia].horarios.push(horario);
    });
    
    return horarioSemanal;
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
  
  /**
   * Obtener nombre del día de la semana
   * @param {number} diaSemana - Día de la semana (0-6)
   * @returns {string} - Nombre del día
   */
  obtenerNombreDia(diaSemana) {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[diaSemana] || 'Desconocido';
  }
}

module.exports = new HorarioSedeLogic(); 