const sedeLogic = require('../logic/SedeLogic');

/**
 * Crear una nueva sede
 */
const crearSede = async (req, res) => {
  try {
    const { nombre, direccion, ciudad, telefono, email, descripcion } = req.body;
    
    // Validaciones básicas
    if (!nombre || !direccion || !ciudad) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: nombre, direccion, ciudad'
      });
    }
    
    const sede = await sedeLogic.crearSede({
      nombre,
      direccion,
      ciudad,
      telefono,
      email,
      descripcion
    });
    
    res.status(201).json({
      message: 'Sede creada exitosamente',
      sede
    });
  } catch (error) {
    console.error('Error al crear sede:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtener todas las sedes
 */
const listarSedes = async (req, res) => {
  try {
    const sedes = await sedeLogic.listarSedes();
    res.status(200).json(sedes);
  } catch (error) {
    console.error('Error al listar sedes:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener una sede por ID
 */
const obtenerSedePorId = async (req, res) => {
  try {
    const { sedeId } = req.params;
    
    if (!sedeId) {
      return res.status(400).json({
        error: 'ID de sede requerido'
      });
    }
    
    const sede = await sedeLogic.obtenerSedePorId(sedeId);
    res.status(200).json(sede);
  } catch (error) {
    console.error('Error al obtener sede:', error);
    res.status(404).json({ error: error.message });
  }
};

/**
 * Actualizar una sede
 */
const actualizarSede = async (req, res) => {
  try {
    const { sedeId } = req.params;
    const datosActualizacion = req.body;
    
    if (!sedeId) {
      return res.status(400).json({
        error: 'ID de sede requerido'
      });
    }
    
    const sede = await sedeLogic.actualizarSede(sedeId, datosActualizacion);
    
    res.status(200).json({
      message: 'Sede actualizada exitosamente',
      sede
    });
  } catch (error) {
    console.error('Error al actualizar sede:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Eliminar una sede
 */
const eliminarSede = async (req, res) => {
  try {
    const { sedeId } = req.params;
    
    if (!sedeId) {
      return res.status(400).json({
        error: 'ID de sede requerido'
      });
    }
    
    const resultado = await sedeLogic.eliminarSede(sedeId);
    
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al eliminar sede:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cambiar estado de una sede
 */
const cambiarEstadoSede = async (req, res) => {
  try {
    const { sedeId } = req.params;
    const { estado } = req.body;
    
    if (!sedeId) {
      return res.status(400).json({
        error: 'ID de sede requerido'
      });
    }
    
    if (typeof estado !== 'boolean') {
      return res.status(400).json({
        error: 'El estado debe ser un valor booleano'
      });
    }
    
    const sede = await sedeLogic.cambiarEstadoSede(sedeId, estado);
    
    res.status(200).json({
      message: `Sede ${estado ? 'activada' : 'desactivada'} exitosamente`,
      sede
    });
  } catch (error) {
    console.error('Error al cambiar estado de sede:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtener estadísticas de una sede
 */
const obtenerEstadisticasSede = async (req, res) => {
  try {
    const { sedeId } = req.params;
    
    if (!sedeId) {
      return res.status(400).json({
        error: 'ID de sede requerido'
      });
    }
    
    const estadisticas = await sedeLogic.obtenerEstadisticasSede(sedeId);
    res.status(200).json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas de sede:', error);
    res.status(404).json({ error: error.message });
  }
};

/**
 * Buscar sedes por criterios
 */
const buscarSedes = async (req, res) => {
  try {
    const { nombre, ciudad, estado } = req.query;
    
    const criterios = {};
    if (nombre) criterios.nombre = nombre;
    if (ciudad) criterios.ciudad = ciudad;
    if (estado !== undefined) criterios.estado = estado === 'true';
    
    const sedes = await sedeLogic.buscarSedes(criterios);
    res.status(200).json(sedes);
  } catch (error) {
    console.error('Error al buscar sedes:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearSede,
  listarSedes,
  obtenerSedePorId,
  actualizarSede,
  eliminarSede,
  cambiarEstadoSede,
  obtenerEstadisticasSede,
  buscarSedes
}; 