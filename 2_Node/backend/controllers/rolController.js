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

module.exports = { crearRol, listarRoles }; 