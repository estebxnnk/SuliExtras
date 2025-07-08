const rolLogic = require('../logic/rolLogic');

const crearRol = async (req, res) => {
  try {
    const rol = await rolLogic.crearRol(req.body);
    res.status(201).json(rol);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const listarRoles = async (req, res) => {
  try {
    const roles = await rolLogic.listarRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarRol = async (req, res) => {
  try {
    const resultado = await rolLogic.eliminarRol(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { crearRol, listarRoles, eliminarRol }; 