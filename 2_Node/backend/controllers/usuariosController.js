const UsuariosLogic = require('../logic/UsuariosLogic');

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuariosLogic.obtenerUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar usuario
const editarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const datos = req.body;
    const usuario = await UsuariosLogic.editarUsuario(id, datos);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await UsuariosLogic.eliminarUsuario(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await UsuariosLogic.obtenerUsuarioPorId(id);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  obtenerUsuarios,
  editarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorId
}; 