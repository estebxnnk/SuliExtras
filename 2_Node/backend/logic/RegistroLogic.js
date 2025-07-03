const Registro = require('../models/Registro');
const Hora = require('../models/Hora');


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

// Crear un nuevo registro con horas asociadas
const crearRegistro = async (data) => {
  const { horas, ...registroData } = data;
  const nuevoRegistro = await Registro.create(registroData);

  for (const hora of horas) {
    await nuevoRegistro.addHora(hora.id, { through: { cantidad: hora.cantidad } });
  }

  return nuevoRegistro;
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
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro
};
