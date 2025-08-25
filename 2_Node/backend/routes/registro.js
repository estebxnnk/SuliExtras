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

module.exports = router;
