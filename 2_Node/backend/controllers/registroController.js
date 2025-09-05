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

const getRegistrosByUsuario = async (req, res) => {
  try {
    const { usuario } = req.params;
    
    if (!usuario) {
      return res.status(400).json({ error: 'El parámetro usuario es requerido' });
    }

    const registros = await registroLogic.obtenerRegistrosPorUsuario(usuario);
    
    if (registros.length === 0) {
      return res.status(404).json({ 
        message: `No se encontraron registros para el usuario: ${usuario}`,
        registros: []
      });
    }

    res.status(200).json({
      message: `Registros encontrados para el usuario: ${usuario}`,
      total: registros.length,
      registros
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRegistrosByUsuarioId = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    if (!usuarioId) {
      return res.status(400).json({ error: 'El parámetro usuarioId es requerido' });
    }

    const registros = await registroLogic.obtenerRegistrosPorUsuarioId(usuarioId);
    
    if (registros.length === 0) {
      return res.status(404).json({ 
        message: `No se encontraron registros para el usuario ID: ${usuarioId}`,
        registros: []
      });
    }

    // Mostrar en consola los datos completos
    console.log('Registros enviados en la respuesta:', JSON.stringify(registros, null, 2));

    res.status(200).json({
      message: `Registros encontrados para el usuario ID: ${usuarioId}`,
      total: registros.length,
      registros
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRegistrosConUsuario = async (req, res) => {
  try {
    const registros = await registroLogic.obtenerRegistrosConUsuario();
    res.status(200).json({
      message: 'Registros con información de usuario',
      total: registros.length,
      registros
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRegistrosPorUsuarioConInfo = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    if (!usuarioId) {
      return res.status(400).json({ error: 'El parámetro usuarioId es requerido' });
    }

    const registros = await registroLogic.obtenerRegistrosPorUsuarioConInfo(usuarioId);
    
    if (registros.length === 0) {
      return res.status(404).json({ 
        message: `No se encontraron registros para el usuario ID: ${usuarioId}`,
        registros: []
      });
    }

    res.status(200).json({
      message: `Registros encontrados para el usuario ID: ${usuarioId}`,
      total: registros.length,
      registros
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const debugRegistros = async (req, res) => {
  try {
    const registros = await registroLogic.obtenerRegistros();
    
    res.status(200).json({
      message: 'Debug: Todos los registros en la base de datos',
      total: registros.length,
      registros: registros.map(reg => ({
        id: reg.id,
        usuario: reg.usuario,
        usuarioId: reg.usuarioId,
        fecha: reg.fecha,
        numRegistro: reg.numRegistro,
        estado: reg.estado,
        ubicacion: reg.ubicacion,
        horaIngreso: reg.horaIngreso,
        horaSalida: reg.horaSalida,
        cantidadHorasExtra: reg.cantidadHorasExtra
      }))
    });
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

// Nuevo endpoint para crear registro con división de horas
const createRegistroConDivisionHoras = async (req, res) => {
  try {
    const nuevoRegistro = await registroLogic.crearRegistroConDivisionHoras(req.body);
    res.status(201).json(nuevoRegistro);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Nuevo endpoint: crear registro calculando automáticamente horas extra según sede
const createRegistroAutoHorasExtra = async (req, res) => {
  try {
    const nuevoRegistro = await registroLogic.crearRegistroAutoHorasExtra(req.body);
    res.status(201).json(nuevoRegistro);
  } catch (err) {
    const status = err.message && err.message.includes('requerido') ? 400 : 500;
    res.status(status).json({ error: err.message || 'Error interno del servidor' });
  }
};

const crearRegistrosBulk = async (req, res) => {
  try {
    const { registros, usuarioId } = req.body;
    
    // Las validaciones ya se realizan en el middleware de validación
    
    // Crear registros usando la lógica existente
    const registrosCreados = await registroLogic.crearRegistrosBulk(registros, usuarioId);
    
    res.status(201).json({
      message: `${registrosCreados.length} registros creados exitosamente`,
      total: registrosCreados.length,
      registros: registrosCreados
    });
    
  } catch (err) {
    console.error('Error al crear registros bulk:', err);
    res.status(500).json({ 
      error: err.message || 'Error interno del servidor al crear registros'
    });
  }
};

// Obtener registros organizados por semana
const getRegistrosPorSemana = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { fechaInicio } = req.query; // Opcional: fecha para calcular la semana
    
    if (!usuarioId) {
      return res.status(400).json({ 
        error: 'El usuarioId es requerido' 
      });
    }
    
    const semana = await registroLogic.obtenerRegistrosPorSemana(usuarioId, fechaInicio);
    
    res.status(200).json({
      message: `Registros de la semana del ${semana.semana.fechaInicio} al ${semana.semana.fechaFin}`,
      semana: semana.semana,
      registrosPorDia: semana.registrosPorDia,
      totales: semana.totales,
      registros: semana.registros
    });
    
  } catch (err) {
    console.error('Error al obtener registros por semana:', err);
    res.status(500).json({ 
      error: err.message || 'Error interno del servidor al obtener registros por semana'
    });
  }
};

// Obtener registros de la semana a partir de una fecha (todos los usuarios)
const getRegistrosPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    
    if (!fecha) {
      return res.status(400).json({ 
        error: 'La fecha es requerida' 
      });
    }
    
    const registrosFecha = await registroLogic.obtenerRegistrosPorFecha(fecha);
    
    res.status(200).json({
      message: `Registros de la semana del ${registrosFecha.semana.fechaInicio} al ${registrosFecha.semana.fechaFin}`,
      semana: registrosFecha.semana,
      usuarios: registrosFecha.usuarios,
      totales: registrosFecha.totales
    });
    
  } catch (err) {
    console.error('Error al obtener registros por fecha:', err);
    res.status(500).json({ 
      error: err.message || 'Error interno del servidor al obtener registros por fecha'
    });
  }
};

// Aprobar todos los registros de una semana
const aprobarRegistrosSemana = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { fechaInicio } = req.body; // Fecha para calcular la semana
    
    if (!usuarioId) {
      return res.status(400).json({ 
        error: 'El usuarioId es requerido' 
      });
    }
    
    const semana = await registroLogic.aprobarRegistrosSemana(usuarioId, fechaInicio);
    
    res.status(200).json({
      message: `Registros de la semana del ${semana.semana.fechaInicio} al ${semana.semana.fechaFin} aprobados exitosamente`,
      semana: semana.semana,
      registrosPorDia: semana.registrosPorDia,
      totales: semana.totales,
      registros: semana.registros
    });
    
  } catch (err) {
    console.error('Error al aprobar registros de la semana:', err);
    res.status(500).json({ 
      error: err.message || 'Error interno del servidor al aprobar registros'
    });
  }
};

module.exports = {
  getAllRegistros,
  getRegistroById,
  getRegistrosByUsuario,
  getRegistrosByUsuarioId,
  getRegistrosConUsuario,
  getRegistrosPorUsuarioConInfo,
  getRegistrosPorSemana,
  getRegistrosPorFecha,
  aprobarRegistrosSemana,
  debugRegistros,
  createRegistro,
  updateRegistro,
  deleteRegistro,
  createRegistroConDivisionHoras,
  crearRegistrosBulk,
  createRegistroAutoHorasExtra
};
