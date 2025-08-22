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
    
    // Validar datos requeridos
    const { nombre, tipo, horaEntrada, horaSalida, horasJornada, horasJornadaReal, tiempoAlmuerzo, diasTrabajados } = horarioData;
    
    if (!nombre || !tipo || !horaEntrada || !horaSalida || horasJornada === undefined || horasJornadaReal === undefined || tiempoAlmuerzo === undefined || diasTrabajados === undefined) {
      throw new Error('Faltan campos requeridos para el horario');
    }
    
    // Validar tipo
    if (!['normal', 'nocturno', 'especial', 'festivo'].includes(tipo)) {
      throw new Error('Tipo de horario inválido');
    }
    
    // Validar rangos
    if (tiempoAlmuerzo < 0 || tiempoAlmuerzo > 180) {
      throw new Error('Tiempo de almuerzo debe estar entre 0 y 180 minutos');
    }
    
    if (diasTrabajados < 0 || diasTrabajados > 7) {
      throw new Error('Días trabajados debe estar entre 0 y 7');
    }
    
    // Obtener horarios actuales o inicializar array vacío
    const horariosActuales = sede.horarios || [];
    
    // Verificar que no exista un horario con el mismo tipo
    //const tipoExistente = horariosActuales.find(h => h.tipo === tipo);
    //if (tipoExistente) {
      //throw new Error(`Ya existe un horario de tipo '${tipo}' en esta sede`);
    
    
    // Crear nuevo horario
    const nuevoHorario = {
      nombre,
      tipo,
      horaEntrada,
      horaSalida,
      horasJornada,
      horasJornadaReal,
      tiempoAlmuerzo,
      diasTrabajados,
      activo: horarioData.activo !== undefined ? horarioData.activo : true,
      descripcion: horarioData.descripcion || null
    };
    
    // Agregar al array
    horariosActuales.push(nuevoHorario);
    
    // Actualizar sede
    await sede.update({ horarios: horariosActuales });
    
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
    
    // Actualizar sede
    await sede.update({ horarios: horariosActuales });
    
    return sede;
  }
}

module.exports = new SedeLogic();