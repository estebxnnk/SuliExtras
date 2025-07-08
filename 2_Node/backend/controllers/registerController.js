const registerLogic = require('../logic/registerLogic');

const registrarUsuario = async (req, res) => {
  try {
    const user = await registerLogic.registrarUsuario(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { registrarUsuario }; 