const User = require('../models/User');
const Persona = require('../models/Persona');
const Rol = require('../models/Roles');

// Obtener todos los usuarios incluyendo los datos de Persona y Rol
async function obtenerUsuarios() {
  return await User.findAll({
    include: [
      { model: Persona, as: 'persona' },
      { model: Rol, as: 'rol' }
    ]
  });
}

// Editar un usuario por ID
async function editarUsuario(id, datos) {
  const usuario = await User.findByPk(id);
  if (!usuario) throw new Error('Usuario no encontrado');

  // Separar datos de usuario y de persona
  const { persona: datosPersona, ...datosUsuario } = datos;

  // Actualizar datos del usuario
  await usuario.update(datosUsuario);

  // Si hay datos de persona, actualizar la persona asociada
  if (datosPersona) {
    const persona = await Persona.findByPk(usuario.personaId);
    if (!persona) throw new Error('Persona asociada no encontrada');
    await persona.update(datosPersona);
    // Opcional: incluir los datos de persona actualizados en la respuesta
    usuario.setDataValue('persona', persona);
  }

  return usuario;
}

// Eliminar un usuario por ID
async function eliminarUsuario(id) {
  const usuario = await User.findByPk(id);
  if (!usuario) throw new Error('Usuario no encontrado');
  await usuario.destroy();
  return { mensaje: 'Usuario eliminado correctamente' };
}

// Obtener un usuario por ID incluyendo Persona y Rol
async function obtenerUsuarioPorId(id) {
  const usuario = await User.findByPk(id, {
    include: [
      { model: Persona, as: 'persona' },
      { model: Rol, as: 'rol' }
    ]
  });
  if (!usuario) throw new Error('Usuario no encontrado');
  return usuario;
}

module.exports = {
  obtenerUsuarios,
  editarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorId
}; 