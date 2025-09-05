const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');
const { 
  validarCrearRegistrosBulk, 
  validarLogicaNegocio, 
  manejarErroresValidacion 
} = require('../validators/registroValidator');

/**
 * @swagger
 * tags:
 *   name: Registros
 *   description: Gestión de registros de horas extra
 */

/**
 * @swagger
 * /api/registros:
 *   get:
 *     summary: Obtener todos los registros
 *     tags: [Registros]
 *     responses:
 *       200:
 *         description: Lista de registros
 *       500:
 *         description: Error del servidor
 */
router.get('/', registroController.getAllRegistros);

/**
 * @swagger
 * /api/registros/con-usuario:
 *   get:
 *     summary: Obtener todos los registros con información del usuario
 *     tags: [Registros]
 *     responses:
 *       200:
 *         description: Lista de registros con información del usuario
 *       500:
 *         description: Error del servidor
 */
router.get('/con-usuario', registroController.getRegistrosConUsuario);

/**
 * @swagger
 * /api/registros/usuario/{usuario}:
 *   get:
 *     summary: Obtener registros por usuario
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: usuario
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de usuario para filtrar registros
 *     responses:
 *       200:
 *         description: Registros del usuario encontrados
 *       404:
 *         description: No se encontraron registros para el usuario
 *       500:
 *         description: Error del servidor
 */
router.get('/usuario/:usuario', registroController.getRegistrosByUsuario);

/**
 * @swagger
 * /api/registros/usuario-id/{usuarioId}:
 *   get:
 *     summary: Obtener registros por ID de usuario
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario para filtrar registros
 *     responses:
 *       200:
 *         description: Registros del usuario encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 registros:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       fecha:
 *                         type: string
 *                         format: date
 *                       horaIngreso:
 *                         type: string
 *                       horaSalida:
 *                         type: string
 *                       ubicacion:
 *                         type: string
 *                       usuario:
 *                         type: string
 *                       usuarioId:
 *                         type: integer
 *                       numRegistro:
 *                         type: string
 *                       cantidadHorasExtra:
 *                         type: number
 *                         description: Horas reales registradas
 *                       horas_extra_divididas:
 *                         type: number
 *                         description: Máximo 2 horas extra por registro para reporte
 *                       bono_salarial:
 *                         type: number
 *                         description: Horas extra que exceden el máximo y se consideran bono salarial
 *                       justificacionHoraExtra:
 *                         type: string
 *                       estado:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No se encontraron registros para el usuario
 *       500:
 *         description: Error del servidor
 */
router.get('/usuario-id/:usuarioId', registroController.getRegistrosByUsuarioId);

/**
 * @swagger
 * /api/registros/usuario-completo/{usuarioId}:
 *   get:
 *     summary: Obtener registros por ID de usuario con información completa
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario para filtrar registros
 *     responses:
 *       200:
 *         description: Registros del usuario con información completa
 *       404:
 *         description: No se encontraron registros para el usuario
 *       500:
 *         description: Error del servidor
 */
router.get('/usuario-completo/:usuarioId', registroController.getRegistrosPorUsuarioConInfo);

/**
 * @swagger
 * /api/registros/{id}:
 *   get:
 *     summary: Obtener un registro por ID
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro encontrado
 *       404:
 *         description: Registro no encontrado
 */
router.get('/:id', registroController.getRegistroById);
/**
 * @swagger
 * components:
 *   schemas:
 *     RegistroInput:
 *       type: object
 *       required:
 *         - fecha
 *         - horaIngreso
 *         - horaSalida
 *         - ubicacion
 *         - usuarioId
 *         - numRegistro
 *         - cantidadHorasExtra
 *         - estado
 *       properties:
 *         fecha:
 *           type: string
 *           format: date
 *           example: "2025-07-03"
 *         horaIngreso:
 *           type: string
 *           example: "18:00"
 *         horaSalida:
 *           type: string
 *           example: "22:00"
 *         ubicacion:
 *           type: string
 *           example: "Oficina Principal"
 *         usuarioId:
 *           type: integer
 *           description: ID del usuario que crea el registro
 *           example: 1
 *         numRegistro:
 *           type: string
 *           example: "RG123456"
 *         cantidadHorasExtra:
 *           type: number
 *           format: float
 *           example: 4.0
 *         justificacionHoraExtra:
 *           type: string
 *           example: "Finalización de informe financiero"
 *         estado:
 *           type: string
 *           enum: [pendiente, enviado, aprobado, rechazado]
 *           example: "pendiente"
 *         horas:
 *           type: array
 *           description: Lista de tipos de hora asociados con su cantidad
 *           items:
 *             type: object
 *             required:
 *               - id
 *               - cantidad
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               cantidad:
 *                 type: number
 *                 format: float
 *                 example: 2.5
 */

/**
 * @swagger
 * /api/registros:
 *   post:
 *     summary: Crear un nuevo registro
 *     tags: [Registros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroInput'
 *     responses:
 *       201:
 *         description: Registro creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', registroController.createRegistro);

/**
 * @swagger
 * /api/registros/{id}:
 *   put:
 *     summary: Actualizar un registro
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroInput'
 *     responses:
 *       200:
 *         description: Registro actualizado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Registro no encontrado
 */
router.put('/:id', registroController.updateRegistro);

/**
 * @swagger
 * /api/registros/{id}:
 *   delete:
 *     summary: Eliminar un registro
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro eliminado
 *       404:
 *         description: Registro no encontrado
 */
router.delete('/:id', registroController.deleteRegistro);

/**
 * @swagger
 * /api/registros/debug:
 *   get:
 *     summary: Debug - Ver todos los registros (solo para desarrollo)
 *     tags: [Registros]
 *     responses:
 *       200:
 *         description: Lista de registros con información básica
 */
router.get('/debug', registroController.debugRegistros);

/**
 * @swagger
 * /api/registros/dividir-horas:
 *   post:
 *     summary: Crear un nuevo registro dividiendo las horas extra en horas_extra (máx 2), bono_salarial (resto) y horas_reales (todas las horas registradas)
 *     tags: [Registros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroInput'
 *     responses:
 *       201:
 *         description: Registro creado exitosamente con los campos divididos
 *       400:
 *         description: Error en la solicitud
 */
router.post('/dividir-horas', registroController.createRegistroConDivisionHoras);

/**
 * @swagger
 * /api/registros/auto-horas:
 *   post:
 *     summary: Crear registro calculando automáticamente horas extra según horario de la sede del usuario
 *     description: Calcula cantidadHorasExtra comparando la horaSalida del registro con la horaSalida del horario activo de la sede del usuario. Divide automáticamente en horas_extra_divididas (máx 2) y bono_salarial (excedente), reutilizando la lógica existente.
 *     tags: [Registros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fecha
 *               - horaIngreso
 *               - horaSalida
 *               - ubicacion
 *               - usuarioId
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-03"
 *               horaIngreso:
 *                 type: string
 *                 example: "18:00"
 *               horaSalida:
 *                 type: string
 *                 example: "22:30"
 *               ubicacion:
 *                 type: string
 *                 example: "Oficina Principal"
 *               usuarioId:
 *                 type: integer
 *                 description: ID del usuario que crea el registro
 *                 example: 1
 *               justificacionHoraExtra:
 *                 type: string
 *                 example: "Cierre mensual"
 *     responses:
 *       201:
 *         description: Registro creado exitosamente con cálculo automático de horas extra
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post('/auto-horas', registroController.createRegistroAutoHorasExtra);

/**
 * @swagger
 * /api/registros/bulk:
 *   post:
 *     summary: Crear múltiples registros de horas extra
 *     tags: [Registros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registros
 *               - usuarioId
 *             properties:
 *               registros:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - fecha
 *                     - horaIngreso
 *                     - horaSalida
 *                     - ubicacion
 *                     - cantidadHorasExtra
 *                   properties:
 *                     fecha:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-15"
 *                     horaIngreso:
 *                       type: string
 *                       example: "18:00"
 *                     horaSalida:
 *                       type: string
 *                       example: "20:00"
 *                     ubicacion:
 *                       type: string
 *                       example: "Oficina Principal"
 *                     cantidadHorasExtra:
 *                       type: number
 *                       example: 2.5
 *                     justificacionHoraExtra:
 *                       type: string
 *                       example: "Proyecto urgente"
 *               usuarioId:
 *                 type: integer
 *                 description: ID del usuario que crea los registros
 *                 example: 1
 *     responses:
 *       201:
 *         description: Registros creados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 registros:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Registro'
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/bulk', 
  validarCrearRegistrosBulk, 
  validarLogicaNegocio, 
  registroController.crearRegistrosBulk
);

/**
 * @swagger
 * /api/registros/semana/{usuarioId}:
 *   get:
 *     summary: Obtener registros organizados por semana (lunes a domingo)
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *       - in: query
 *         name: fechaInicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para calcular la semana (opcional, usa fecha actual si no se proporciona)
 *     responses:
 *       200:
 *         description: Registros organizados por semana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 semana:
 *                   type: object
 *                   properties:
 *                     fechaInicio:
 *                       type: string
 *                       format: date
 *                     fechaFin:
 *                       type: string
 *                       format: date
 *                     lunes:
 *                       type: string
 *                       format: date
 *                     domingo:
 *                       type: string
 *                       format: date
 *                 registrosPorDia:
 *                   type: object
 *                   properties:
 *                     lunes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Registro'
 *                     martes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Registro'
 *                     miercoles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Registro'
 *                     jueves:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Registro'
 *                     viernes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Registro'
 *                     sabado:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Registro'
 *                     domingo:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Registro'
 *                 totales:
 *                   type: object
 *                   properties:
 *                     totalHorasExtra:
 *                       type: number
 *                     totalHorasExtraDivididas:
 *                       type: number
 *                     totalBonoSalarial:
 *                       type: number
 *                     totalRegistros:
 *                       type: integer
 *                 registros:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Registro'
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error del servidor
 */
/**
 * @swagger
 * /api/registros/fecha/{fecha}:
 *   get:
 *     summary: Obtener registros de todos los usuarios para una fecha específica
 *     description: Retorna todos los registros de una fecha específica organizados por usuario, con totales individuales y generales
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para obtener registros (formato YYYY-MM-DD)
 *         example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Registros obtenidos exitosamente organizados por usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registros obtenidos para la fecha 2024-01-15"
 *                 fecha:
 *                   type: string
 *                   format: date
 *                   description: Fecha consultada
 *                   example: "2024-01-15"
 *                 registrosPorUsuario:
 *                   type: object
 *                   description: Registros agrupados por ID de usuario
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       usuarioId:
 *                         type: integer
 *                         description: ID del usuario
 *                         example: 1
 *                       email:
 *                         type: string
 *                         description: Email del usuario
 *                         example: "usuario@empresa.com"
 *                       nombre:
 *                         type: string
 *                         description: Nombre del usuario
 *                         example: "Juan"
 *                       apellido:
 *                         type: string
 *                         description: Apellido del usuario
 *                         example: "Pérez"
 *                       registros:
 *                         type: array
 *                         description: Lista de registros del usuario para esa fecha
 *                         items:
 *                           $ref: '#/components/schemas/Registro'
 *                       totales:
 *                         type: object
 *                         description: Totales del usuario para esa fecha
 *                         properties:
 *                           totalHorasExtra:
 *                             type: number
 *                             description: Total de horas extra del usuario
 *                             example: 8.5
 *                           totalHorasExtraDivididas:
 *                             type: number
 *                             description: Total de horas extra divididas (máx 2 por registro)
 *                             example: 2.0
 *                           totalBonoSalarial:
 *                             type: number
 *                             description: Total de bono salarial del usuario
 *                             example: 6.5
 *                           totalRegistros:
 *                             type: integer
 *                             description: Cantidad total de registros del usuario
 *                             example: 2
 *                 totalesGenerales:
 *                   type: object
 *                   description: Totales generales de todos los usuarios para esa fecha
 *                   properties:
 *                     totalHorasExtra:
 *                       type: number
 *                       description: Total de horas extra de todos los usuarios
 *                       example: 15.5
 *                     totalHorasExtraDivididas:
 *                       type: number
 *                       description: Total de horas extra divididas de todos los usuarios
 *                       example: 4.0
 *                     totalBonoSalarial:
 *                       type: number
 *                       description: Total de bono salarial de todos los usuarios
 *                       example: 11.5
 *                     totalRegistros:
 *                       type: integer
 *                       description: Cantidad total de registros de todos los usuarios
 *                       example: 4
 *                     totalUsuarios:
 *                       type: integer
 *                       description: Cantidad total de usuarios con registros
 *                       example: 2
 *                 registros:
 *                   type: array
 *                   description: Lista completa de todos los registros de la fecha
 *                   items:
 *                     $ref: '#/components/schemas/Registro'
 *       400:
 *         description: Fecha requerida o formato inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "La fecha es requerida"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor al obtener registros por fecha"
 *                 details:
 *                   type: string
 *                   example: "Error de conexión a la base de datos"
 */
router.get('/fecha/:fecha', registroController.getRegistrosPorFecha);

router.get('/semana/:usuarioId', registroController.getRegistrosPorSemana);

/**
 * @swagger
 * /api/registros/semana/{usuarioId}/aprobar:
 *   post:
 *     summary: Aprobar todos los registros de una semana
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha para calcular la semana
 *                 example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Registros aprobados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 semana:
 *                   type: object
 *                 registrosPorDia:
 *                   type: object
 *                 totales:
 *                   type: object
 *                 registros:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Registro'
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/semana/:usuarioId/aprobar', registroController.aprobarRegistrosSemana);

module.exports = router;
