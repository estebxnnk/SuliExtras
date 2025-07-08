const Hora = require('../models/Hora');

class HoraLogic {
  async listarHoras() {
    return await Hora.findAll();
  }

  async obtenerHoraPorTipo(tipo) {
    const hora = await Hora.findOne({ where: { tipo } });
    if (!hora) throw new Error('Hora no encontrada');
    return hora;
  }

  async crearHora(data) {
    return await Hora.create(data);
  }

  async actualizarHora(tipo, data) {
    const hora = await Hora.findOne({ where: { tipo } });
    if (!hora) throw new Error('Hora no encontrada');
    await hora.update(data);
    return hora;
  }

  async eliminarHora(tipo) {
    const deleted = await Hora.destroy({ where: { tipo } });
    if (!deleted) throw new Error('Hora no encontrada');
    return { message: 'Hora eliminada' };
  }
}

module.exports = new HoraLogic(); 