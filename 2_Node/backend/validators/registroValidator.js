const { body, validationResult } = require('express-validator');

// Validaciones para crear registros individuales
const validarCrearRegistro = [
  body('fecha')
    .notEmpty()
    .withMessage('La fecha es requerida')
    .isISO8601()
    .withMessage('Formato de fecha inválido. Use YYYY-MM-DD'),
  
  body('horaIngreso')
    .notEmpty()
    .withMessage('La hora de ingreso es requerida')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de hora inválido. Use HH:MM'),
  
  body('horaSalida')
    .notEmpty()
    .withMessage('La hora de salida es requerida')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de hora inválido. Use HH:MM'),
  
  body('ubicacion')
    .notEmpty()
    .withMessage('La ubicación es requerida')
    .isLength({ min: 2, max: 100 })
    .withMessage('La ubicación debe tener entre 2 y 100 caracteres'),
  
  body('cantidadHorasExtra')
    .notEmpty()
    .withMessage('La cantidad de horas extra es requerida')
    .isFloat({ min: 0.1 })
    .withMessage('La cantidad de horas extra debe ser mayor a 0'),
  
  body('usuarioId')
    .notEmpty()
    .withMessage('El usuarioId es requerido')
    .isInt({ min: 1 })
    .withMessage('El usuarioId debe ser un número entero válido'),
  
  body('justificacionHoraExtra')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La justificación no puede exceder 500 caracteres')
];

// Validaciones para crear registros bulk
const validarCrearRegistrosBulk = [
  body('usuarioId')
    .notEmpty()
    .withMessage('El usuarioId es requerido')
    .isInt({ min: 1 })
    .withMessage('El usuarioId debe ser un número entero válido'),
  
  body('registros')
    .notEmpty()
    .withMessage('El array de registros es requerido')
    .isArray({ min: 1 })
    .withMessage('Debe enviar al menos un registro'),
  
  body('registros.*.fecha')
    .notEmpty()
    .withMessage('La fecha es requerida para cada registro')
    .isISO8601()
    .withMessage('Formato de fecha inválido. Use YYYY-MM-DD'),
  
  body('registros.*.horaIngreso')
    .notEmpty()
    .withMessage('La hora de ingreso es requerida para cada registro')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de hora inválido. Use HH:MM'),
  
  body('registros.*.horaSalida')
    .notEmpty()
    .withMessage('La hora de salida es requerida para cada registro')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de hora inválido. Use HH:MM'),
  
  body('registros.*.ubicacion')
    .notEmpty()
    .withMessage('La ubicación es requerida para cada registro')
    .isLength({ min: 2, max: 100 })
    .withMessage('La ubicación debe tener entre 2 y 100 caracteres'),
  
  body('registros.*.cantidadHorasExtra')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La cantidad de horas extra debe ser un número válido'),
  
  body('registros.*.justificacionHoraExtra')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La justificación no puede exceder 500 caracteres')
];

// Validaciones personalizadas para lógica de negocio
const validarLogicaNegocio = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Datos de entrada inválidos',
      details: errors.array() 
    });
  }

  // Validar que hora de salida sea mayor que hora de entrada
  if (req.body.registros) {
    // Validación para bulk
    for (let i = 0; i < req.body.registros.length; i++) {
      const registro = req.body.registros[i];
      if (registro.horaSalida <= registro.horaIngreso) {
        return res.status(400).json({ 
          error: `Registro ${i + 1}: La hora de salida debe ser mayor que la hora de entrada` 
        });
      }
    }
  } else {
    // Validación para registro individual
    if (req.body.horaSalida <= req.body.horaIngreso) {
      return res.status(400).json({ 
        error: 'La hora de salida debe ser mayor que la hora de entrada' 
      });
    }
  }

  next();
};

// Validaciones para actualizar registros
const validarActualizarRegistro = [
  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha inválido. Use YYYY-MM-DD'),
  
  body('horaIngreso')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de hora inválido. Use HH:MM'),
  
  body('horaSalida')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de hora inválido. Use HH:MM'),
  
  body('ubicacion')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('La ubicación debe tener entre 2 y 100 caracteres'),
  
  body('cantidadHorasExtra')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('La cantidad de horas extra debe ser mayor a 0'),
  
  body('justificacionHoraExtra')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La justificación no puede exceder 500 caracteres')
];

// Middleware para manejar errores de validación
const manejarErroresValidacion = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Datos de entrada inválidos',
      details: errors.array() 
    });
  }
  next();
};

module.exports = {
  validarCrearRegistro,
  validarCrearRegistrosBulk,
  validarLogicaNegocio,
  validarActualizarRegistro,
  manejarErroresValidacion
};
