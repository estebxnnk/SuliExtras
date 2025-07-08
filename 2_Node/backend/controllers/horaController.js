const horaLogic = require('../logic/HoraLogic');

const listarHoras = async (req, res) => {
  try {
    const horas = await horaLogic.listarHoras();
    res.status(200).json(horas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obtenerHoraPorTipo = async (req, res) => {
  try {
    const hora = await horaLogic.obtenerHoraPorTipo(req.params.tipo);
    res.status(200).json(hora);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const crearHora = async (req, res) => {
  try {
    const nuevaHora = await horaLogic.crearHora(req.body);
    res.status(201).json(nuevaHora);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const actualizarHora = async (req, res) => {
  try {
    const hora = await horaLogic.actualizarHora(req.params.tipo, req.body);
    res.status(200).json(hora);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const eliminarHora = async (req, res) => {
  try {
    const resultado = await horaLogic.eliminarHora(req.params.tipo);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = {
  listarHoras,
  obtenerHoraPorTipo,
  crearHora,
  actualizarHora,
  eliminarHora
}; 