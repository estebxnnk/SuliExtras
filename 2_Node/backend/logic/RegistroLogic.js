const Registro = require('../models/Registro');
const Hora = require('../models/Hora');
const User = require('../models/User');


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
  const { horas, ...registroData } = data;
  const registro = await Registro.findByPk(id);
  if (!registro) throw new Error('Registro no encontrado');

  await registro.update(registroData);

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

module.exports = {
  obtenerRegistros,
  obtenerRegistroPorId,
  obtenerRegistrosPorUsuario,
  obtenerRegistrosPorUsuarioId,
  obtenerRegistrosConUsuario,
  obtenerRegistrosPorUsuarioConInfo,
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro
};
