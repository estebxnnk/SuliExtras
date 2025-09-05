const Registro = require('../models/Registro');
const Hora = require('../models/Hora');
const User = require('../models/User');
const sequelize = require('../configDb/db').sequelize;
const { Op } = require('sequelize');
const Persona = require('../models/Persona');
const { startOfISOWeek, endOfISOWeek, parseISO, format, isValid, getISODay } = require('date-fns');
const SedeLogic = require('./SedeLogic');

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

// Obtener registros por usuario (usando el campo usuario existente)
const obtenerRegistrosPorUsuario = async (usuario) => {
  return await Registro.findAll({
    where: { usuario },
    include: {
      model: Hora,
      through: {
        attributes: ['cantidad']
      }
    },
    order: [['fecha', 'DESC']] // Ordenar por fecha descendente (más recientes primero)
  });
};

// Obtener registros por ID de usuario (usando el campo usuarioId si existe)
const obtenerRegistrosPorUsuarioId = async (usuarioId) => {
  return await Registro.findAll({
    where: { usuarioId },
    attributes: [
      'id',
      'fecha',
      'horaIngreso',
      'horaSalida',
      'ubicacion',
      'usuario',
      'usuarioId',
      'numRegistro',
      'cantidadHorasExtra', // Horas reales
      'horas_extra_divididas', // Máximo 2
      'bono_salarial', // Excedente
      'justificacionHoraExtra',
      'estado',
      'createdAt',
      'updatedAt'
    ],
    include: {
      model: Hora,
      through: {
        attributes: ['cantidad']
      }
    },
    order: [['fecha', 'DESC']]
  });
};

// Obtener registros con información completa del usuario
const obtenerRegistrosConUsuario = async () => {
  return await Registro.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      },
      {
        model: Hora,
        through: {
          attributes: ['cantidad']
        }
      }
    ],
    order: [['fecha', 'DESC']]
  });
};

// Obtener registros por usuario con información completa
const obtenerRegistrosPorUsuarioConInfo = async (usuarioId) => {
  return await Registro.findAll({
    where: { usuarioId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      },
      {
        model: Hora,
        through: {
          attributes: ['cantidad']
        }
      }
    ],
    order: [['fecha', 'DESC']]
  });
};

// Helpers reutilizables para agrupar por día y calcular totales
const diasSemanaNombres = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

const crearEstructuraRegistrosPorDia = () => ({
  lunes: [],
  martes: [],
  miercoles: [],
  jueves: [],
  viernes: [],
  sabado: [],
  domingo: []
});

const mapearRegistrosPorDia = (registros) => {
  const registrosPorDia = crearEstructuraRegistrosPorDia();
  registros.forEach((registro) => {
    // Tomar la fecha como string (DATEONLY) para evitar desfases de timezone
    const fechaStr = typeof registro.fecha === 'string' 
      ? registro.fecha 
      : format(new Date(registro.fecha), 'yyyy-MM-dd');
    const fecha = parseISO(fechaStr);
    const isoDay = getISODay(fecha); // 1 (lunes) .. 7 (domingo)
    const diaSemana = diasSemanaNombres[isoDay - 1];
    registrosPorDia[diaSemana].push(registro);
  });
  return registrosPorDia;
};

// Agrupa por día y dentro de cada día por usuario
const mapearRegistrosPorDiaYUsuario = (registros) => {
  const estructuraInicial = () => ({ usuarios: {} });
  const resultado = {
    lunes: estructuraInicial(),
    martes: estructuraInicial(),
    miercoles: estructuraInicial(),
    jueves: estructuraInicial(),
    viernes: estructuraInicial(),
    sabado: estructuraInicial(),
    domingo: estructuraInicial()
  };

  registros.forEach((registro) => {
    const fechaStr = typeof registro.fecha === 'string' 
      ? registro.fecha 
      : format(new Date(registro.fecha), 'yyyy-MM-dd');
    const fecha = parseISO(fechaStr);
    const isoDay = getISODay(fecha); // 1..7
    const diaSemana = diasSemanaNombres[isoDay - 1];

    const usuariosDia = resultado[diaSemana].usuarios;
    const key = registro.usuarioId;
    if (!usuariosDia[key]) {
      usuariosDia[key] = {
        usuarioId: registro.usuarioId,
        usuario: registro.usuario,
        registros: [],
        totales: {
          totalHorasExtra: 0,
          totalHorasExtraDivididas: 0,
          totalBonoSalarial: 0,
          totalRegistros: 0
        }
      };
    }

    const bucket = usuariosDia[key];
    bucket.registros.push(registro);
    bucket.totales.totalHorasExtra += Number(registro.cantidadHorasExtra) || 0;
    bucket.totales.totalHorasExtraDivididas += Number(registro.horas_extra_divididas) || 0;
    bucket.totales.totalBonoSalarial += Number(registro.bono_salarial) || 0;
    bucket.totales.totalRegistros += 1;
  });

  return resultado;
};

// Agrupa por usuario y dentro de cada usuario por día
const mapearRegistrosPorUsuarioYDia = (registros) => {
  const usuarios = {};
  const diasVacios = () => ({
    lunes: [],
    martes: [],
    miercoles: [],
    jueves: [],
    viernes: [],
    sabado: [],
    domingo: []
  });

  registros.forEach((registro) => {
    const fechaStr = typeof registro.fecha === 'string' 
      ? registro.fecha 
      : format(new Date(registro.fecha), 'yyyy-MM-dd');
    const fecha = parseISO(fechaStr);
    const isoDay = getISODay(fecha); // 1..7
    const diaSemana = diasSemanaNombres[isoDay - 1];

    const key = registro.usuarioId;
    if (!usuarios[key]) {
      usuarios[key] = {
        usuarioId: registro.usuarioId,
        usuario: registro.usuario,
        registrosPorDia: diasVacios(),
        totales: {
          totalHorasExtra: 0,
          totalHorasExtraDivididas: 0,
          totalBonoSalarial: 0,
          totalRegistros: 0
        }
      };
    }

    const u = usuarios[key];
    u.registrosPorDia[diaSemana].push(registro);
    u.totales.totalHorasExtra += Number(registro.cantidadHorasExtra) || 0;
    u.totales.totalHorasExtraDivididas += Number(registro.horas_extra_divididas) || 0;
    u.totales.totalBonoSalarial += Number(registro.bono_salarial) || 0;
    u.totales.totalRegistros += 1;
  });

  return usuarios;
};

const calcularTotalesBasicos = (registros) => {
  const totales = {
    totalHorasExtra: 0,
    totalHorasExtraDivididas: 0,
    totalBonoSalarial: 0,
    totalRegistros: registros.length
  };
  registros.forEach((registro) => {
    totales.totalHorasExtra += Number(registro.cantidadHorasExtra) || 0;
    totales.totalHorasExtraDivididas += Number(registro.horas_extra_divididas) || 0;
    totales.totalBonoSalarial += Number(registro.bono_salarial) || 0;
  });
  return totales;
};

// Obtener registros por semana (lunes a domingo)
const obtenerRegistrosPorSemana = async (usuarioId, fechaInicio) => {
  try {
    // Si no se proporciona fecha, usar la fecha actual y obtener inicio/fin de semana ISO
    const base = fechaInicio ? parseISO(fechaInicio) : new Date();
    const lunes = startOfISOWeek(base);
    const domingo = endOfISOWeek(base);
    
    // Formatear fechas para la consulta
    const fechaInicioStr = format(lunes, 'yyyy-MM-dd');
    const fechaFinStr = format(domingo, 'yyyy-MM-dd');
    
    const registros = await Registro.findAll({
      where: {
        usuarioId,
        fecha: {
          [Op.between]: [fechaInicioStr, fechaFinStr]
        }
      },
      attributes: [
        'id',
        'fecha',
        'horaIngreso',
        'horaSalida',
        'ubicacion',
        'usuario',
        'usuarioId',
        'numRegistro',
        'cantidadHorasExtra',
        'horas_extra_divididas',
        'bono_salarial',
        'justificacionHoraExtra',
        'estado',
        'createdAt',
        'updatedAt'
      ],
      order: [['fecha', 'ASC'], ['horaIngreso', 'ASC']]
    });
      
    // Organizar por usuario y por día para la semana de un usuario
    const usuarios = mapearRegistrosPorUsuarioYDia(registros);
    
    // Calcular totales semanales
    const totales = calcularTotalesBasicos(registros);
    
    return {
      semana: {
        fechaInicio: fechaInicioStr,
        fechaFin: fechaFinStr,
        lunes: fechaInicioStr,
        domingo: fechaFinStr
      },
      usuarios,
      totales
    };
    
  } catch (error) {
    console.error('Error en obtenerRegistrosPorSemana:', error);
    throw error;
  }
};

// Aprobar registros de una semana
const aprobarRegistrosSemana = async (usuarioId, fechaInicio) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Obtener registros de la semana
    const semana = await obtenerRegistrosPorSemana(usuarioId, fechaInicio);
    
    // Actualizar estado de todos los registros a 'aprobado'
    const registrosIds = semana.registros.map(r => r.id);
    
    if (registrosIds.length === 0) {
      throw new Error('No hay registros para aprobar en esta semana');
    }
    
    await Registro.update(
      { estado: 'aprobado' },
      { 
        where: { id: { [Op.in]: registrosIds } },
        transaction 
      }
    );
    
    await transaction.commit();
    
    // Retornar registros actualizados
    return await obtenerRegistrosPorSemana(usuarioId, fechaInicio);
    
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Obtener registros de la semana a partir de una fecha (todos los usuarios)
const obtenerRegistrosPorFecha = async (fecha) => {
  try {
    // Usar la fecha recibida (o actual) para obtener el lunes y domingo de esa semana (ISO)
    const base = fecha ? parseISO(fecha) : new Date();
    if (!isValid(base)) {
      throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
    }

    const lunes = startOfISOWeek(base);
    const domingo = endOfISOWeek(base);

    const fechaInicioStr = format(lunes, 'yyyy-MM-dd');
    const fechaFinStr = format(domingo, 'yyyy-MM-dd');

    // Obtener registros de toda la semana para todos los usuarios
    const registros = await Registro.findAll({
      where: {
        fecha: {
          [Op.between]: [fechaInicioStr, fechaFinStr]
        }
      },
      attributes: [
        'id', 'fecha', 'horaIngreso', 'horaSalida', 'ubicacion',
        'usuario', 'usuarioId', 'numRegistro', 'cantidadHorasExtra',
        'horas_extra_divididas', 'bono_salarial', 'justificacionHoraExtra',
        'estado', 'createdAt', 'updatedAt'
      ],
      order: [['fecha', 'ASC'], ['horaIngreso', 'ASC']]
    });

    // Organizar por usuario y por día (estructura solicitada)
    const usuarios = mapearRegistrosPorUsuarioYDia(registros);
    const totales = calcularTotalesBasicos(registros);

    return {
      semana: {
        fechaInicio: fechaInicioStr,
        fechaFin: fechaFinStr,
        lunes: fechaInicioStr,
        domingo: fechaFinStr
      },
      usuarios,
      totales
    };
    
  } catch (error) {
    console.error('Error en obtenerRegistrosPorFecha:', error);
    throw error;
  }
};

// Función auxiliar para procesar registros por usuario
const procesarRegistrosPorUsuario = (registros) => {
  const registrosPorUsuario = {};
  
  // Agrupar registros por usuario
  registros.forEach(registro => {
    const usuarioId = registro.usuarioId;
    
    if (!registrosPorUsuario[usuarioId]) {
      registrosPorUsuario[usuarioId] = crearEstructuraUsuario(registro);
    }
    
    agregarRegistroAUsuario(registrosPorUsuario[usuarioId], registro);
  });
  
  // Calcular totales generales
  const totalesGenerales = calcularTotalesGenerales(registros, registrosPorUsuario);
  
  return { registrosPorUsuario, totalesGenerales };
};

// Función auxiliar para crear estructura de usuario
const crearEstructuraUsuario = (registro) => ({
  usuarioId: registro.usuarioId,
  email: registro.usuario,
  nombre: registro.user?.nombre || 'N/A',
  apellido: registro.user?.apellido || 'N/A',
  registros: [],
  totales: {
    totalHorasExtra: 0,
    totalHorasExtraDivididas: 0,
    totalBonoSalarial: 0,
    totalRegistros: 0
  }
});

// Función auxiliar para agregar registro a usuario
const agregarRegistroAUsuario = (usuario, registro) => {
  usuario.registros.push(registro);
  usuario.totales.totalHorasExtra += Number(registro.cantidadHorasExtra) || 0;
  usuario.totales.totalHorasExtraDivididas += Number(registro.horas_extra_divididas) || 0;
  usuario.totales.totalBonoSalarial += Number(registro.bono_salarial) || 0;
  usuario.totales.totalRegistros += 1;
};

// Función auxiliar para calcular totales generales
const calcularTotalesGenerales = (registros, registrosPorUsuario) => {
  const totalesGenerales = {
    totalHorasExtra: 0,
    totalHorasExtraDivididas: 0,
    totalBonoSalarial: 0,
    totalRegistros: registros.length,
    totalUsuarios: Object.keys(registrosPorUsuario).length
  };
  
  Object.values(registrosPorUsuario).forEach(usuario => {
    totalesGenerales.totalHorasExtra += usuario.totales.totalHorasExtra;
    totalesGenerales.totalHorasExtraDivididas += usuario.totales.totalHorasExtraDivididas;
    totalesGenerales.totalBonoSalarial += usuario.totales.totalBonoSalarial;
  });
  
  return totalesGenerales;
};

// Lógica para dividir las horas extra
function dividirHorasExtra(cantidad) {
  const horas_extra_divididas = Math.min(2, cantidad);
  const bono_salarial = cantidad > 2 ? cantidad - 2 : 0;
  const cantidadHorasExtra = cantidad; // Horas reales
  return { horas_extra_divididas, bono_salarial, cantidadHorasExtra };
}

// Helpers para cálculo de horas extra basado en sede
function timeStringToMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== 'string') return null;
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function seleccionarHorarioActivoPrincipal(horarios) {
  if (!Array.isArray(horarios) || horarios.length === 0) return null;
  const activos = horarios.filter(h => h && h.activo);
  const lista = activos.length > 0 ? activos : horarios;
  // Escoger el que tenga mayor horaSalida en minutos (máximo final de jornada)
  let seleccionado = null;
  let maxSalida = -1;
  for (const h of lista) {
    const salidaMin = timeStringToMinutes(h.horaSalida);
    if (salidaMin !== null && salidaMin > maxSalida) {
      seleccionado = h;
      maxSalida = salidaMin;
    }
  }
  return seleccionado;
}

function calcularHorasExtraSegunSede(horaSalidaRegistro, sede) {
  if (!sede) return 0;
  const horario = seleccionarHorarioActivoPrincipal(sede.horarios || []);
  if (!horario) return 0;
  const salidaRegMin = timeStringToMinutes(horaSalidaRegistro);
  const salidaHorMin = timeStringToMinutes(horario.horaSalida);
  if (salidaRegMin === null || salidaHorMin === null) return 0;
  // Si la hora de salida del registro sobrepasa la del horario de sede, contar excedente
  const excedente = Math.max(0, salidaRegMin - salidaHorMin);
  return parseFloat((excedente / 60).toFixed(2));
}

function normalizarTipoBusqueda(base) {
  if (!base || typeof base !== 'string') return null;
  // Quitar puntos y espacios, poner mayúsculas
  return base.replace(/[\.\s]/g, '').toUpperCase();
}

async function encontrarHoraPorTipoFlexible(tipoCorto, respaldoDenominacion) {
  const candidato = normalizarTipoBusqueda(tipoCorto); // p.ej HED o HEN
  const variantes = candidato ? [candidato, `${candidato[0]}.${candidato[1]}.${candidato[2]}`] : [];
  let hora = null;
  if (variantes.length > 0) {
    hora = await Hora.findOne({ where: { tipo: { [Op.in]: variantes } } });
  }
  if (!hora && respaldoDenominacion) {
    hora = await Hora.findOne({ where: { denominacion: respaldoDenominacion } });
  }
  return hora;
}

function overlapMinutes(aStart, aEnd, bStart, bEnd) {
  const start = Math.max(aStart, bStart);
  const end = Math.min(aEnd, bEnd);
  return Math.max(0, end - start);
}

function calcularDistribucionDiurnaNocturna(extraStartMin, extraEndMin) {
  // Nocturno 22:00-06:00, considerado en dos bloques relativos
  if (extraEndMin <= extraStartMin) return { minutosNocturnos: 0, minutosDiurnos: 0 };
  const bloquesNocturnos = [
    [1320, 1440], // 22:00-24:00
    [1440, 1800]  // 00:00-06:00 siguiente día
  ];
  let minutosNocturnos = 0;
  for (const [bStart, bEnd] of bloquesNocturnos) {
    minutosNocturnos += overlapMinutes(extraStartMin, extraEndMin, bStart, bEnd);
  }
  const total = extraEndMin - extraStartMin;
  const minutosDiurnos = Math.max(0, total - minutosNocturnos);
  return { minutosNocturnos, minutosDiurnos };
}

// Nuevo registro especial con lógica de división de horas
const crearRegistroConDivisionHoras = async (data) => {
  const { cantidadHorasExtra, usuarioId, usuario, ...registroData } = data;

  if (!usuarioId) {
    throw new Error('El usuarioId es requerido para crear un registro');
  }

  const user = await User.findByPk(usuarioId);
  if (!user) {
    throw new Error(`No se encontró un usuario con el ID: ${usuarioId}`);
  }

  // Dividir las horas extra
  const { horas_extra_divididas, bono_salarial } = dividirHorasExtra(Number(cantidadHorasExtra));

  // Crear el registro con los nuevos campos
  const nuevoRegistro = await Registro.create({
    ...registroData,
    usuarioId,
    usuario: user.email,
    cantidadHorasExtra: Number(cantidadHorasExtra), // Horas reales
    horas_extra_divididas,
    bono_salarial
  });

  return nuevoRegistro;
};

// Crear registro calculando automáticamente horas extra en base a la sede del usuario
const crearRegistroAutoHorasExtra = async (data) => {
  const { usuarioId, usuario, cantidadHorasExtra, numRegistro, ...registroData } = data;

  if (!usuarioId) {
    throw new Error('El usuarioId es requerido para crear un registro');
  }

  const user = await User.findByPk(usuarioId);
  if (!user) {
    throw new Error(`No se encontró un usuario con el ID: ${usuarioId}`);
  }

  // Obtener sede del usuario para determinar horario
  let sedeUsuario = null;
  try {
    const info = await SedeLogic.obtenerSedePorUsuario(usuarioId);
    sedeUsuario = info?.sede || null;
  } catch (e) {
    // Si no hay sede o falla, continuar pero con 0 horas extra
    sedeUsuario = null;
  }

  // Calcular horas extra automáticamente en función del horario de la sede
  const horasExtraCalculadas = calcularHorasExtraSegunSede(registroData.horaSalida, sedeUsuario);

  // Dividir las horas extra como en la lógica existente
  const { horas_extra_divididas, bono_salarial } = dividirHorasExtra(Number(horasExtraCalculadas));

  // Generar número de registro si no viene
  const numReg = numRegistro || generarNumeroRegistro();

  const nuevoRegistro = await Registro.create({
    ...registroData,
    usuarioId,
    usuario: user.email,
    numRegistro: numReg,
    cantidadHorasExtra: Number(horasExtraCalculadas),
    horas_extra_divididas,
    bono_salarial
  });

  // Asociar tipos de hora según distribución diurna/nocturna hasta el máximo reportable (2)
  try {
    const horario = seleccionarHorarioActivoPrincipal(sedeUsuario?.horarios || []);
    if (horario && horasExtraCalculadas > 0 && horas_extra_divididas > 0) {
      const salidaHorMin = timeStringToMinutes(horario.horaSalida);
      const salidaRegMin = timeStringToMinutes(registroData.horaSalida);
      const extraStartMin = salidaHorMin;
      const extraEndMin = salidaRegMin >= salidaHorMin ? salidaRegMin : salidaRegMin + 1440;
      const { minutosNocturnos, minutosDiurnos } = calcularDistribucionDiurnaNocturna(extraStartMin, extraEndMin);

      const horasNocturnas = parseFloat((minutosNocturnos / 60).toFixed(2));
      const horasDiurnas = Math.max(0, parseFloat((horasExtraCalculadas - horasNocturnas).toFixed(2)));

      let restante = horas_extra_divididas;

      // Buscar registros de Catálogo Hora: HEN = extra nocturna, HED = extra diurna
      const horaNocturna = await encontrarHoraPorTipoFlexible('HEN', 'Hora extra nocturna');
      const horaDiurna = await encontrarHoraPorTipoFlexible('HED', 'Hora extra diurna');

      if (horaNocturna && restante > 0 && horasNocturnas > 0) {
        const cant = Math.min(restante, horasNocturnas);
        await nuevoRegistro.addHora(horaNocturna, { through: { cantidad: cant } });
        restante = parseFloat((restante - cant).toFixed(2));
      }

      if (horaDiurna && restante > 0 && horasDiurnas > 0) {
        const cant = Math.min(restante, horasDiurnas);
        await nuevoRegistro.addHora(horaDiurna, { through: { cantidad: cant } });
      }
    }
  } catch (asocErr) {
    console.warn('No se pudo asociar tipos de hora:', asocErr?.message || asocErr);
  }

  return nuevoRegistro;
};

// Crear un nuevo registro con horas asociadas
const crearRegistro = async (data) => {
  const { horas, usuarioId, usuario, ...registroData } = data;
  
  // Validar que se proporcione usuarioId
  if (!usuarioId) {
    throw new Error('El usuarioId es requerido para crear un registro');
  }

  // Verificar que el usuario existe
  const user = await User.findByPk(usuarioId);
  if (!user) {
    throw new Error(`No se encontró un usuario con el ID: ${usuarioId}`);
  }

  // Crear el registro con el usuarioId
  const nuevoRegistro = await Registro.create({
    ...registroData,
    usuarioId,
    usuario: user.email // Usar el email del usuario como identificador
  });

  // Asociar las horas si se proporcionan
  if (horas && horas.length > 0) {
    for (const hora of horas) {
      await nuevoRegistro.addHora(hora.id, { through: { cantidad: hora.cantidad } });
    }
  }

  // Retornar el registro con la información del usuario
  const registroCompleto = await Registro.findByPk(nuevoRegistro.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      },
      {
        model: Hora,
        through: {
          attributes: ['cantidad']
        }
      }
    ]
  });

  return registroCompleto;
};

// Actualizar un registro y sus horas
const actualizarRegistro = async (id, data) => {
  const { horas, cantidadHorasExtra, ...registroData } = data;
  const registro = await Registro.findByPk(id);
  if (!registro) throw new Error('Registro no encontrado');

  // Si se edita la cantidad de horas extra, recalcular los campos
  let updateFields = { ...registroData };
  if (typeof cantidadHorasExtra !== 'undefined') {
    const { horas_extra_divididas, bono_salarial } = dividirHorasExtra(Number(cantidadHorasExtra));
    updateFields = {
      ...updateFields,
      cantidadHorasExtra: Number(cantidadHorasExtra),
      horas_extra_divididas,
      bono_salarial
    };
  }

  await registro.update(updateFields);

  // Si se editan los tipos de hora asociados
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

// Crear múltiples registros usando la misma lógica de división de horas
const crearRegistrosBulk = async (registrosData, usuarioId) => {
  // Validar que se proporcione usuarioId
  if (!usuarioId) {
    throw new Error('El usuarioId es requerido para crear registros');
  }

  // Verificar que el usuario existe
  const user = await User.findByPk(usuarioId);
  if (!user) {
    throw new Error(`No se encontró un usuario con el ID: ${usuarioId}`);
  }

  const transaction = await sequelize.transaction();
  
  try {
    const registrosCreados = [];
    
    for (const registroData of registrosData) {
      const { cantidadHorasExtra, ...otrosDatos } = registroData;
      
      // Dividir las horas extra usando la misma función
      const { horas_extra_divididas, bono_salarial } = dividirHorasExtra(Number(cantidadHorasExtra));
      
      // Generar número de registro único
      const numRegistro = generarNumeroRegistro();
      
      // Crear el registro con la misma lógica
      const nuevoRegistro = await Registro.create({
        ...otrosDatos,
        usuarioId,
        usuario: user.email,
        numRegistro: numRegistro,
        cantidadHorasExtra: Number(cantidadHorasExtra),
        horas_extra_divididas,
        bono_salarial
      }, { transaction });
      
      registrosCreados.push(nuevoRegistro);
    }
    
    await transaction.commit();
    return registrosCreados;
    
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Función auxiliar para generar número de registro único
const generarNumeroRegistro = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `REG-${timestamp}-${random}`;
};

module.exports = {
  obtenerRegistros,
  obtenerRegistroPorId,
  obtenerRegistrosPorUsuario,
  obtenerRegistrosPorUsuarioId,
  obtenerRegistrosConUsuario,
  obtenerRegistrosPorUsuarioConInfo,
  obtenerRegistrosPorSemana,
  obtenerRegistrosPorFecha,
  aprobarRegistrosSemana,
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro,
  crearRegistroConDivisionHoras,
  crearRegistrosBulk,
  crearRegistroAutoHorasExtra
};
