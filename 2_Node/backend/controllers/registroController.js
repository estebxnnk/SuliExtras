const registroLogic = require('../logic/RegistroLogic');

const getAllRegistros = async (req, res) => {
  try {
    const registros = await registroLogic.obtenerRegistros();
    res.status(200).json(registros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRegistroById = async (req, res) => {
  try {
    const registro = await registroLogic.obtenerRegistroPorId(req.params.id);
    if (!registro) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    res.status(200).json(registro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createRegistro = async (req, res) => {
  try {
    const nuevoRegistro = await registroLogic.crearRegistro(req.body);
    res.status(201).json(nuevoRegistro);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateRegistro = async (req, res) => {
  try {
    const registroActualizado = await registroLogic.actualizarRegistro(req.params.id, req.body);
    res.status(200).json(registroActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteRegistro = async (req, res) => {
  try {
    const resultado = await registroLogic.eliminarRegistro(req.params.id);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllRegistros,
  getRegistroById,
  createRegistro,
  updateRegistro,
  deleteRegistro
};
