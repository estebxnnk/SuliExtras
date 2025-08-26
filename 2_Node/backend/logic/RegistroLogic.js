const Registro = require('../models/Registro');
const Hora = require('../models/Hora');
const User = require('../models/User');
const sequelize = require('../configDb/db').sequelize;
const { Op } = require('sequelize');


// Obtener todos los registros con sus horas asociadas
const obtenerRegistros = async () => {
  return await Registro.findAll({
    include: {
      model: Hora,
      through: {
        attributes: ['cantidad']
      }
    }
  });
};

// Obtener un solo registro por ID
const obtenerRegistroPorId = async (id) => {
  return await Registro.findByPk(id, {
    include: {
      model: Hora,
      through: {
        attributes: ['cantidad']
      }
    }
  });
};

// Obtener registros por usuario (usando el campo usuario existente)
const obtenerRegistrosPorUsuario = async (usuario) => {
  return await Registro.findAll({
    where: { usuario },
    include: {
      model: Hora,
      through: {
        attributes: ['cantidad']
      }
    },
    order: [['fecha', 'DESC']] // Ordenar por fecha descendente (más recientes primero)
  });
};

// Obtener registros por ID de usuario (usando el campo usuarioId si existe)
const obtenerRegistrosPorUsuarioId = async (usuarioId) => {
  return await Registro.findAll({
    where: { usuarioId },
    attributes: [
      'id',
      'fecha',
      'horaIngreso',
      'horaSalida',
      'ubicacion',
      'usuario',
      'usuarioId',
      'numRegistro',
      'cantidadHorasExtra', // Horas reales
      'horas_extra_divididas', // Máximo 2
      'bono_salarial', // Excedente
      'justificacionHoraExtra',
      'estado',
      'createdAt',
      'updatedAt'
    ],
    include: {
      model: Hora,
      through: {
        attributes: ['cantidad']
      }
    },
    order: [['fecha', 'DESC']]
  });
};

// Obtener registros con información completa del usuario
const obtenerRegistrosConUsuario = async () => {
  return await Registro.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      },
      {
        model: Hora,
        through: {
          attributes: ['cantidad']
        }
      }
    ],
    order: [['fecha', 'DESC']]
  });
};

// Obtener registros por usuario con información completa
const obtenerRegistrosPorUsuarioConInfo = async (usuarioId) => {
  return await Registro.findAll({
    where: { usuarioId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      },
      {
        model: Hora,
        through: {
          attributes: ['cantidad']
        }
      }
    ],
    order: [['fecha', 'DESC']]
  });
};

// Obtener registros por semana (lunes a domingo)
const obtenerRegistrosPorSemana = async (usuarioId, fechaInicio) => {
  try {
    // Si no se proporciona fecha, usar la fecha actual
    const fecha = fechaInicio ? new Date(fechaInicio) : new Date();
    
    // Obtener el lunes de la semana (día 1 = lunes)
    const lunes = new Date(fecha);
    const diaSemana = fecha.getDay(); // 0 = domingo, 1 = lunes, etc.
    const diasDesdeLunes = diaSemana === 0 ? 6 : diaSemana - 1; // Si es domingo, retroceder 6 días
    lunes.setDate(fecha.getDate() - diasDesdeLunes);
    lunes.setHours(0, 0, 0, 0);
    
    // Obtener el domingo de la semana
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);
    
    // Formatear fechas para la consulta
    const fechaInicioStr = lunes.toISOString().split('T')[0];
    const fechaFinStr = domingo.toISOString().split('T')[0];
    
    const registros = await Registro.findAll({
      where: {
        usuarioId,
        fecha: {
          [Op.between]: [fechaInicioStr, fechaFinStr]
        }
      },
      attributes: [
        'id',
        'fecha',
        'horaIngreso',
        'horaSalida',
        'ubicacion',
        'usuario',
        'usuarioId',
        'numRegistro',
        'cantidadHorasExtra',
        'horas_extra_divididas',
        'bono_salarial',
        'justificacionHoraExtra',
        'estado',
        'createdAt',
        'updatedAt'
      ],
      order: [['fecha', 'ASC'], ['horaIngreso', 'ASC']]
    });
      
    // Organizar registros por día de la semana
    const registrosPorDia = {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
      sabado: [],
      domingo: []
    };
    
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    
    registros.forEach(registro => {
      const fecha = new Date(registro.fecha);
      const diaSemana = diasSemana[fecha.getDay()];
      registrosPorDia[diaSemana].push(registro);
    });
    
    // Calcular totales semanales
    const totales = {
      totalHorasExtra: 0,
      totalHorasExtraDivididas: 0,
      totalBonoSalarial: 0,
      totalRegistros: registros.length
    };
    
    registros.forEach(registro => {
      totales.totalHorasExtra += Number(registro.cantidadHorasExtra) || 0;
      totales.totalHorasExtraDivididas += Number(registro.horas_extra_divididas) || 0;
      totales.totalBonoSalarial += Number(registro.bono_salarial) || 0;
    });
    
    return {
      semana: {
        fechaInicio: fechaInicioStr,
        fechaFin: fechaFinStr,
        lunes: lunes.toISOString().split('T')[0],
        domingo: domingo.toISOString().split('T')[0]
      },
      registrosPorDia,
      totales,
      registros: registros
    };
    
  } catch (error) {
    console.error('Error en obtenerRegistrosPorSemana:', error);
    throw error;
  }
};

// Aprobar registros de una semana
const aprobarRegistrosSemana = async (usuarioId, fechaInicio) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Obtener registros de la semana
    const semana = await obtenerRegistrosPorSemana(usuarioId, fechaInicio);
    
    // Actualizar estado de todos los registros a 'aprobado'
    const registrosIds = semana.registros.map(r => r.id);
    
    if (registrosIds.length === 0) {
      throw new Error('No hay registros para aprobar en esta semana');
    }
    
    await Registro.update(
      { estado: 'aprobado' },
      { 
        where: { id: { [sequelize.Op.in]: registrosIds } },
        transaction 
      }
    );
    
    await transaction.commit();
    
    // Retornar registros actualizados
    return await obtenerRegistrosPorSemana(usuarioId, fechaInicio);
    
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Lógica para dividir las horas extra
function dividirHorasExtra(cantidad) {
  const horas_extra_divididas = Math.min(2, cantidad);
  const bono_salarial = cantidad > 2 ? cantidad - 2 : 0;
  const cantidadHorasExtra = cantidad; // Horas reales
  return { horas_extra_divididas, bono_salarial, cantidadHorasExtra };
}

// Nuevo registro especial con lógica de división de horas
const crearRegistroConDivisionHoras = async (data) => {
  const { cantidadHorasExtra, usuarioId, usuario, ...registroData } = data;

  if (!usuarioId) {
    throw new Error('El usuarioId es requerido para crear un registro');
  }

  const user = await User.findByPk(usuarioId);
  if (!user) {
    throw new Error(`No se encontró un usuario con el ID: ${usuarioId}`);
  }

  // Dividir las horas extra
  const { horas_extra_divididas, bono_salarial } = dividirHorasExtra(Number(cantidadHorasExtra));

  // Crear el registro con los nuevos campos
  const nuevoRegistro = await Registro.create({
    ...registroData,
    usuarioId,
    usuario: user.email,
    cantidadHorasExtra: Number(cantidadHorasExtra), // Horas reales
    horas_extra_divididas,
    bono_salarial
  });

  return nuevoRegistro;
};

// Crear un nuevo registro con horas asociadas
const crearRegistro = async (data) => {
  const { horas, usuarioId, usuario, ...registroData } = data;
  
  // Validar que se proporcione usuarioId
  if (!usuarioId) {
    throw new Error('El usuarioId es requerido para crear un registro');
  }

  // Verificar que el usuario existe
  const user = await User.findByPk(usuarioId);
  if (!user) {
    throw new Error(`No se encontró un usuario con el ID: ${usuarioId}`);
  }

  // Crear el registro con el usuarioId
  const nuevoRegistro = await Registro.create({
    ...registroData,
    usuarioId,
    usuario: user.email // Usar el email del usuario como identificador
  });

  // Asociar las horas si se proporcionan
  if (horas && horas.length > 0) {
    for (const hora of horas) {
      await nuevoRegistro.addHora(hora.id, { through: { cantidad: hora.cantidad } });
    }
  }

  // Retornar el registro con la información del usuario
  const registroCompleto = await Registro.findByPk(nuevoRegistro.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      },
      {
        model: Hora,
        through: {
          attributes: ['cantidad']
        }
      }
    ]
  });

  return registroCompleto;
};

// Actualizar un registro y sus horas
const actualizarRegistro = async (id, data) => {
  const { horas, cantidadHorasExtra, ...registroData } = data;
  const registro = await Registro.findByPk(id);
  if (!registro) throw new Error('Registro no encontrado');

  // Si se edita la cantidad de horas extra, recalcular los campos
  let updateFields = { ...registroData };
  if (typeof cantidadHorasExtra !== 'undefined') {
    const { horas_extra_divididas, bono_salarial } = dividirHorasExtra(Number(cantidadHorasExtra));
    updateFields = {
      ...updateFields,
      cantidadHorasExtra: Number(cantidadHorasExtra),
      horas_extra_divididas,
      bono_salarial
    };
  }

  await registro.update(updateFields);

  // Si se editan los tipos de hora asociados
  if (horas) {
    await registro.setHoras([]); // Elimina relaciones anteriores
    for (const hora of horas) {
      await registro.addHora(hora.id, { through: { cantidad: hora.cantidad } });
    }
  }

  return registro;
};

// Eliminar un registro
const eliminarRegistro = async (id) => {
  const registro = await Registro.findByPk(id);
  if (!registro) throw new Error('Registro no encontrado');
  await registro.destroy();
  return { mensaje: 'Registro eliminado' };
};

// Crear múltiples registros usando la misma lógica de división de horas
const crearRegistrosBulk = async (registrosData, usuarioId) => {
  // Validar que se proporcione usuarioId
  if (!usuarioId) {
    throw new Error('El usuarioId es requerido para crear registros');
  }

  // Verificar que el usuario existe
  const user = await User.findByPk(usuarioId);
  if (!user) {
    throw new Error(`No se encontró un usuario con el ID: ${usuarioId}`);
  }

  const transaction = await sequelize.transaction();
  
  try {
    const registrosCreados = [];
    
    for (const registroData of registrosData) {
      const { cantidadHorasExtra, ...otrosDatos } = registroData;
      
      // Dividir las horas extra usando la misma función
      const { horas_extra_divididas, bono_salarial } = dividirHorasExtra(Number(cantidadHorasExtra));
      
      // Generar número de registro único
      const numRegistro = generarNumeroRegistro();
      
      // Crear el registro con la misma lógica
      const nuevoRegistro = await Registro.create({
        ...otrosDatos,
        usuarioId,
        usuario: user.email,
        numRegistro: numRegistro,
        cantidadHorasExtra: Number(cantidadHorasExtra),
        horas_extra_divididas,
        bono_salarial
      }, { transaction });
      
      registrosCreados.push(nuevoRegistro);
    }
    
    await transaction.commit();
    return registrosCreados;
    
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Función auxiliar para generar número de registro único
const generarNumeroRegistro = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `REG-${timestamp}-${random}`;
};

module.exports = {
  obtenerRegistros,
  obtenerRegistroPorId,
  obtenerRegistrosPorUsuario,
  obtenerRegistrosPorUsuarioId,
  obtenerRegistrosConUsuario,
  obtenerRegistrosPorUsuarioConInfo,
  obtenerRegistrosPorSemana,
  aprobarRegistrosSemana,
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro,
  crearRegistroConDivisionHoras,
  crearRegistrosBulk
};
