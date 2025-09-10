const Sede = require('../models/Sede');
const User = require('../models/User');
const Persona = require('../models/Persona');
const Rol = require('../models/Roles');
const { Op } = require('sequelize');

class SedeLogic {
  /**
   * Crear una nueva sede
   * @param {Object} data - Datos de la sede
   * @returns {Object} - Sede creada
   */
  async crearSede(data) {
    const { nombre, direccion, ciudad, telefono, email, descripcion, horarios } = data;
    
    // Verificar que el nombre sea único
    const sedeExistente = await Sede.findOne({ where: { nombre } });
    if (sedeExistente) {
      throw new Error('Ya existe una sede con ese nombre');
    }
    
    const sede = await Sede.create({
      nombre,
      direccion,
      ciudad,
      telefono,
      email,
      descripcion,
      horarios // Guardar el array de horarios directamente
    });
    
    return sede;
  }
  
  /**
   * Obtener todas las sedes
   * @returns {Array} - Lista de sedes
   */
  async listarSedes() {
    return await Sede.findAll({
      include: [
        {
          model: User,
          as: 'usuarios',
          include: [
            { model: Persona, as: 'persona' },
            { model: Rol, as: 'rol' }
          ]
        }
      ],
      order: [['nombre', 'ASC']]
    });
  }
  
  /**
   * Obtener una sede por ID
   * @param {number} sedeId - ID de la sede
   * @returns {Object} - Sede encontrada
   */
  async obtenerSedePorId(sedeId) {
    const sede = await Sede.findByPk(sedeId, {
      include: [
        {
          model: User,
          as: 'usuarios',
          include: [
            { model: Persona, as: 'persona' },
            { model: Rol, as: 'rol' }
          ]
        }
      ]
    });
    
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    
    return sede;
  }
  
  /**
   * Actualizar una sede
   * @param {number} sedeId - ID de la sede
   * @param {Object} data - Datos a actualizar
   * @returns {Object} - Sede actualizada
   */
  async actualizarSede(sedeId, data) {
    const sede = await Sede.findByPk(sedeId);
    
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    
    // Si se está cambiando el nombre, verificar que sea único
    if (data.nombre && data.nombre !== sede.nombre) {
      const sedeExistente = await Sede.findOne({ 
        where: { 
          nombre: data.nombre,
          id: { [Op.ne]: sedeId }
        }
      });
      
      if (sedeExistente) {
        throw new Error('Ya existe una sede con ese nombre');
      }
    }
    
    await sede.update(data);
    return sede;
  }
  
  /**
   * Eliminar una sede
   * @param {number} sedeId - ID de la sede
   * @returns {Object} - Resultado de la eliminación
   */
  async eliminarSede(sedeId) {
    const sede = await Sede.findByPk(sedeId, {
      include: [{ model: User, as: 'usuarios' }]
    });
    
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    
    // Verificar que no tenga usuarios asignados
    if (sede.usuarios && sede.usuarios.length > 0) {
      throw new Error('No se puede eliminar una sede que tiene usuarios asignados');
    }
    
    // Eliminar la sede
    await sede.destroy();
    
    return { message: 'Sede eliminada exitosamente' };
  }
  
  /**
   * Cambiar estado de una sede (activar/desactivar)
   * @param {number} sedeId - ID de la sede
   * @param {boolean} estado - Nuevo estado
   * @returns {Object} - Sede actualizada
   */
  async cambiarEstadoSede(sedeId, estado) {
    const sede = await Sede.findByPk(sedeId);
    
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    
    await sede.update({ estado });
    return sede;
  }
  
  /**
   * Obtener estadísticas de una sede
   * @param {number} sedeId - ID de la sede
   * @returns {Object} - Estadísticas de la sede
   */
  async obtenerEstadisticasSede(sedeId) {
    const sede = await Sede.findByPk(sedeId, {
      include: [
        {
          model: User,
          as: 'usuarios',
          include: [{ model: Rol, as: 'rol' }]
        }
      ]
    });
    
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    
    const totalUsuarios = sede.usuarios.length;
    const empleados = sede.usuarios.filter(u => u.rol.nombre === 'Empleado').length;
    const supervisores = sede.usuarios.filter(u => 
      ['JefeDirecto', 'Administrador', 'SuperAdministrador'].includes(u.rol.nombre)
    ).length;
    
    // Contar horarios activos desde el campo JSON
    const horariosActivos = sede.horarios ? sede.horarios.filter(h => h.activo).length : 0;
    
    return {
      sede: {
        id: sede.id,
        nombre: sede.nombre,
        ciudad: sede.ciudad
      },
      estadisticas: {
        totalUsuarios,
        empleados,
        supervisores,
        horariosActivos
      }
    };
  }
  
  /**
   * Buscar sedes por criterios
   * @param {Object} criterios - Criterios de búsqueda
   * @returns {Array} - Sedes que coinciden con los criterios
   */
  async buscarSedes(criterios) {
    const { nombre, ciudad, estado } = criterios;
    const where = {};
    
    if (nombre) {
      where.nombre = { [Op.iLike]: `%${nombre}%` };
    }
    
    if (ciudad) {
      where.ciudad = { [Op.iLike]: `%${ciudad}%` };
    }
    
    if (estado !== undefined) {
      where.estado = estado;
    }
    
    return await Sede.findAll({
      where,
      order: [['nombre', 'ASC']]
    });
  }
  
  /**
   * Agregar un horario a una sede existente
   * @param {number} sedeId - ID de la sede
   * @param {Object} horarioData - Datos del nuevo horario
   * @returns {Object} - Sede actualizada
   */
  async agregarHorario(sedeId, horarioData) {
    const sede = await Sede.findByPk(sedeId);
    
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    
    // Validar datos requeridos (solo campos esenciales)
    const { nombre, tipo, horaEntrada, horaSalida, horasJornada, horasJornadaReal, tiempoAlmuerzo, diasTrabajados } = horarioData;
    
    if (!nombre || !tipo || !horaEntrada || !horaSalida) {
      throw new Error('Faltan campos requeridos para el horario: nombre, tipo, horaEntrada, horaSalida');
    }
    
    // Calcular campos faltantes si no se proporcionan
    const horasJornadaCalculada = horasJornada !== undefined ? horasJornada : this.calcularHorasJornada(horaEntrada, horaSalida);
    const tiempoAlmuerzoFinal = tiempoAlmuerzo !== undefined ? tiempoAlmuerzo : 60;
    const horasJornadaRealCalculada = horasJornadaReal !== undefined ? horasJornadaReal : Math.max(0, horasJornadaCalculada - (tiempoAlmuerzoFinal / 60));
    const diasTrabajadosFinal = diasTrabajados !== undefined ? diasTrabajados : 5;
    
    // Validar tipo
    if (!['normal', 'nocturno', 'especial', 'festivo'].includes(tipo)) {
      throw new Error('Tipo de horario inválido');
    }
    
    // Validar rangos
    if (tiempoAlmuerzoFinal < 0 || tiempoAlmuerzoFinal > 180) {
      throw new Error('Tiempo de almuerzo debe estar entre 0 y 180 minutos');
    }
    
    if (diasTrabajadosFinal < 0 || diasTrabajadosFinal > 7) {
      throw new Error('Días trabajados debe estar entre 0 y 7');
    }
    
    // Obtener horarios actuales o inicializar array vacío
    const horariosActuales = sede.horarios || [];
    
    // Crear nuevo horario con valores calculados
    const nuevoHorario = {
      nombre,
      tipo,
      horaEntrada,
      horaSalida,
      horasJornada: horasJornadaCalculada,
      horasJornadaReal: horasJornadaRealCalculada,
      tiempoAlmuerzo: tiempoAlmuerzoFinal,
      diasTrabajados: diasTrabajadosFinal,
      activo: horarioData.activo !== undefined ? horarioData.activo : true,
      descripcion: horarioData.descripcion || null
    };
    
    // Agregar al array
    horariosActuales.push(nuevoHorario);
    
    console.log('Horarios antes de actualizar:', JSON.stringify(horariosActuales, null, 2));
    
    // Forzar actualización del campo JSON usando changed() para que Sequelize detecte el cambio
    sede.set('horarios', horariosActuales);
    sede.changed('horarios', true);
    await sede.save();
    
    // Recargar la sede desde la base de datos para verificar
    await sede.reload();
    
    console.log('Horarios después de actualizar:', JSON.stringify(sede.horarios, null, 2));
    
    return sede;
  }
  
  /**
   * Eliminar un horario de una sede
   * @param {number} sedeId - ID de la sede
   * @param {number} horarioIndex - Índice del horario a eliminar
   * @returns {Object} - Sede actualizada
   */
  async eliminarHorario(sedeId, horarioIndex) {
    const sede = await Sede.findByPk(sedeId);
    
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    
    const horariosActuales = sede.horarios || [];
    
    if (horarioIndex < 0 || horarioIndex >= horariosActuales.length) {
      throw new Error('Índice de horario inválido');
    }
    
    // Eliminar horario del array
    horariosActuales.splice(horarioIndex, 1);
    
    // Forzar actualización del campo JSON usando changed() para que Sequelize detecte el cambio
    sede.set('horarios', horariosActuales);
    sede.changed('horarios', true);
    await sede.save();
    
    return sede;
  }

  /**
   * Obtener sede por ID de usuario
   * @param {number} usuarioId - ID del usuario
   * @returns {Object} - Sede del usuario
   */
  async obtenerSedePorUsuario(usuarioId) {
    // Primero verificar que el usuario existe
    const usuario = await User.findByPk(usuarioId, {
      include: [
        { model: Persona, as: 'persona' },
        { model: Rol, as: 'rol' }
      ]
    });
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    // Si el usuario no tiene sede asignada
    if (!usuario.sedeId) {
      throw new Error('El usuario no tiene una sede asignada');
    }
    
    // Obtener la sede del usuario
    const sede = await Sede.findByPk(usuario.sedeId, {
      include: [
        {
          model: User,
          as: 'usuarios',
          include: [
            { model: Persona, as: 'persona' },
            { model: Rol, as: 'rol' }
          ]
        }
      ]
    });
    
    if (!sede) {
      throw new Error('La sede asignada al usuario no existe');
    }
    
    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        persona: usuario.persona,
        rol: usuario.rol
      },
      sede: sede
    };
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

module.exports = new SedeLogic();