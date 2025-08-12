const HorasTrabajadas = require('../models/HorasTrabajadas');
const User = require('../models/User');
const Rol = require('../models/Roles');
const Sede = require('../models/Sede');
const HorarioSede = require('../models/HorarioSede');

class HorasTrabajadasLogic {
  /**
   * Calcula las horas trabajadas y determina si hay horas extra
   * @param {string} horaEntrada - Hora de entrada en formato "HH:mm"
   * @param {string} horaSalida - Hora de salida en formato "HH:mm"
   * @param {Object} horarioSede - Horario de la sede del empleado
   * @returns {Object} - Objeto con horas trabajadas, horas extra y tipo
   */
  calcularHorasExtra(horaEntrada, horaSalida, horarioSede = null) {
    // Convertir horas a minutos para facilitar cálculos
    const [hE, mE] = horaEntrada.split(':').map(Number);
    const [hS, mS] = horaSalida.split(':').map(Number);
    
    let entradaMinutos = hE * 60 + mE;
    let salidaMinutos = hS * 60 + mS;
    
    // Si la salida es menor que la entrada, significa que trabajó hasta el día siguiente
    if (salidaMinutos < entradaMinutos) {
      salidaMinutos += 24 * 60; // Agregar 24 horas
    }
    
    const totalMinutos = salidaMinutos - entradaMinutos;
    const horasTrabajadas = totalMinutos / 60;
    
    // Usar jornada de la sede si está disponible, sino usar 8 horas por defecto
    const jornadaNormal = horarioSede ? horarioSede.horasJornada : 8;
    const horasExtra = horasTrabajadas > jornadaNormal ? horasTrabajadas - jornadaNormal : 0;
    
    // Determinar tipo de hora extra según franja horaria
    let tipoHoraExtra = 'Ninguna';
    
    if (horasExtra > 0) {
      // Horas nocturnas: entre 22:00 y 6:00
      const horaEntradaNum = hE;
      const horaSalidaNum = hS;
      
      // Verificar si alguna parte del trabajo fue nocturna
      const esNocturna = this.esHorarioNocturno(horaEntradaNum, horaSalidaNum);
      
      if (esNocturna) {
        tipoHoraExtra = 'Nocturna';
      } else {
        tipoHoraExtra = 'Normal';
      }
    }
    
    return {
      horasTrabajadas: parseFloat(horasTrabajadas.toFixed(2)),
      horasExtra: parseFloat(horasExtra.toFixed(2)),
      tipoHoraExtra,
      jornadaNormal: parseFloat(jornadaNormal.toFixed(2))
    };
  }
  
  /**
   * Determina si el horario de trabajo incluye horas nocturnas
   * @param {number} horaEntrada - Hora de entrada (0-23)
   * @param {number} horaSalida - Hora de salida (0-23)
   * @returns {boolean} - True si incluye horas nocturnas
   */
  esHorarioNocturno(horaEntrada, horaSalida) {
    // Horas nocturnas: 22:00 a 6:00
    const inicioNocturno = 22;
    const finNocturno = 6;
    
    // Si la salida es menor que la entrada, trabajó hasta el día siguiente
    if (horaSalida < horaEntrada) {
      // Verificar si trabajó en horario nocturno
      return horaEntrada >= inicioNocturno || horaSalida <= finNocturno;
    } else {
      // Trabajo en el mismo día
      return (horaEntrada >= inicioNocturno && horaEntrada <= 23) || 
             (horaSalida >= 0 && horaSalida <= finNocturno) ||
             (horaEntrada <= finNocturno && horaSalida >= inicioNocturno);
    }
  }
  
  /**
   * Registra las horas trabajadas de un empleado
   * @param {Object} data - Datos del registro
   * @returns {Object} - Registro creado
   */
  async registrarHoras(data) {
    const { usuarioId, fecha, horaEntrada, horaSalida, observaciones } = data;
    
    // Verificar que el usuario existe y es empleado
    const usuario = await User.findByPk(usuarioId, {
      include: [
        { model: Rol, as: 'rol' },
        { model: Sede, as: 'sede' }
      ]
    });
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    if (usuario.rol.nombre !== 'Empleado') {
      throw new Error('Solo los empleados pueden registrar horas trabajadas');
    }
    
    // Verificar que el usuario tenga una sede asignada
    if (!usuario.sedeId) {
      throw new Error('El empleado debe tener una sede asignada para registrar horas');
    }
    
    // Verificar que no exista un registro para la misma fecha
    const registroExistente = await HorasTrabajadas.findOne({
      where: { usuarioId, fecha }
    });
    
    if (registroExistente) {
      throw new Error('Ya existe un registro para esta fecha');
    }
    
    // Obtener el horario de la sede para el día específico
    const diaSemana = new Date(fecha).getDay(); // 0 = Domingo, 1 = Lunes, etc.
    let horarioSede = null;
    
    try {
      horarioSede = await HorarioSede.findOne({
        where: { 
          sedeId: usuario.sedeId, 
          diaSemana, 
          activo: true 
        }
      });
    } catch (error) {
      console.log('No se encontró horario específico para la sede, usando horario por defecto');
    }
    
    // Calcular horas trabajadas y extra usando el horario de la sede
    const calculo = this.calcularHorasExtra(horaEntrada, horaSalida, horarioSede);
    
    // Crear el registro
    const registro = await HorasTrabajadas.create({
      usuarioId,
      fecha,
      horaEntrada,
      horaSalida,
      horasTrabajadas: calculo.horasTrabajadas,
      horasExtra: calculo.horasExtra,
      tipoHoraExtra: calculo.tipoHoraExtra,
      observaciones
    });
    
    return registro;
  }
  
  /**
   * Obtiene todos los registros de horas trabajadas
   * @returns {Array} - Lista de registros
   */
  async listarRegistros() {
    return await HorasTrabajadas.findAll({
      include: [
        {
          model: User,
          as: 'usuario',
          include: [{ model: require('../models/Persona'), as: 'persona' }]
        }
      ],
      order: [['fecha', 'DESC'], ['createdAt', 'DESC']]
    });
  }
  
  /**
   * Obtiene los registros de un usuario específico
   * @param {number} usuarioId - ID del usuario
   * @returns {Array} - Lista de registros del usuario
   */
  async obtenerRegistrosPorUsuario(usuarioId) {
    return await HorasTrabajadas.findAll({
      where: { usuarioId },
      include: [
        {
          model: User,
          as: 'usuario',
          include: [{ model: require('../models/Persona'), as: 'persona' }]
        }
      ],
      order: [['fecha', 'DESC']]
    });
  }
  
  /**
   * Actualiza el estado de un registro (aprobación/rechazo)
   * @param {number} registroId - ID del registro
   * @param {string} estado - Nuevo estado
   * @param {string} observaciones - Observaciones del supervisor
   * @returns {Object} - Registro actualizado
   */
  async actualizarEstado(registroId, estado, observaciones = null) {
    const registro = await HorasTrabajadas.findByPk(registroId);
    
    if (!registro) {
      throw new Error('Registro no encontrado');
    }
    
    if (!['pendiente', 'aprobado', 'rechazado'].includes(estado)) {
      throw new Error('Estado no válido');
    }
    
    await registro.update({
      estado,
      observaciones: observaciones || registro.observaciones
    });
    
    return registro;
  }
  
  /**
   * Obtiene estadísticas de horas extra por usuario
   * @param {number} usuarioId - ID del usuario
   * @param {string} fechaInicio - Fecha de inicio (YYYY-MM-DD)
   * @param {string} fechaFin - Fecha de fin (YYYY-MM-DD)
   * @returns {Object} - Estadísticas del período
   */
  async obtenerEstadisticas(usuarioId, fechaInicio, fechaFin) {
    const registros = await HorasTrabajadas.findAll({
      where: {
        usuarioId,
        fecha: {
          [require('sequelize').Op.between]: [fechaInicio, fechaFin]
        }
      }
    });
    
    const totalHorasTrabajadas = registros.reduce((sum, reg) => sum + reg.horasTrabajadas, 0);
    const totalHorasExtra = registros.reduce((sum, reg) => sum + reg.horasExtra, 0);
    const registrosAprobados = registros.filter(reg => reg.estado === 'aprobado').length;
    const registrosPendientes = registros.filter(reg => reg.estado === 'pendiente').length;
    
    return {
      totalRegistros: registros.length,
      totalHorasTrabajadas: parseFloat(totalHorasTrabajadas.toFixed(2)),
      totalHorasExtra: parseFloat(totalHorasExtra.toFixed(2)),
      registrosAprobados,
      registrosPendientes,
      registrosRechazados: registros.length - registrosAprobados - registrosPendientes
    };
  }
}

module.exports = new HorasTrabajadasLogic(); 