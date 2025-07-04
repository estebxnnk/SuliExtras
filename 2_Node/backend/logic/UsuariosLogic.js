const User = require('../models/User');
const Persona = require('../models/Persona');

// Obtener todos los usuarios incluyendo los datos de Persona (usando alias 'persona')
async function obtenerUsuarios() {
  return await User.findAll({
    include: [{ model: Persona, as: 'persona' }]
  });
}

// Editar un usuario por ID
async function editarUsuario(id, datos) {
  const usuario = await User.findByPk(id);
  if (!usuario) throw new Error('Usuario no encontrado');
  await usuario.update(datos);
  return usuario;
}

// Eliminar un usuario por ID
async function eliminarUsuario(id) {
  const usuario = await User.findByPk(id);
  if (!usuario) throw new Error('Usuario no encontrado');
  await usuario.destroy();
  return { mensaje: 'Usuario eliminado correctamente' };
}

module.exports = {
  obtenerUsuarios,
  editarUsuario,
  eliminarUsuario
}; 