const express = require('express');
const router = express.Router();
const horasTrabajadasController = require('../controllers/horasTrabajadasController');
const authMiddleware = require('../middleware/authMiddleware');
const { soloEmpleados, soloSupervisores } = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Horas Trabajadas
 *   description: Gestión de registro de horas trabajadas y cálculo de horas extra
 */

/**
 * @swagger
 * /api/horas-trabajadas/registro:
 *   post:
 *     summary: Registrar horas trabajadas de un empleado
 *     tags: [Horas Trabajadas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - fecha
 *               - horaEntrada
 *               - horaSalida
 *             properties:
 *               usuarioId:
 *                 type: integer
 *                 description: ID del usuario empleado
 *                 example: 1
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha del registro (YYYY-MM-DD)
 *                 example: "2024-01-15"
 *               horaEntrada:
 *                 type: string
 *                 description: Hora de entrada en formato HH:mm
 *                 example: "08:00"
 *               horaSalida:
 *                 type: string
 *                 description: Hora de salida en formato HH:mm
 *                 example: "18:00"
 *               observaciones:
 *                 type: string
 *                 description: Observaciones opcionales
 *                 example: "Trabajo extra por proyecto urgente"
 *     responses:
 *       201:
 *         description: Registro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 registro:
 *                   $ref: '#/components/schemas/HorasTrabajadas'
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.post('/registro', authMiddleware, soloEmpleados, horasTrabajadasController.registrarHoras);

/**
 * @swagger
 * /api/horas-trabajadas:
 *   get:
 *     summary: Obtener todos los registros de horas trabajadas
 *     tags: [Horas Trabajadas]
 *     responses:
 *       200:
 *         description: Lista de registros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HorasTrabajadas'
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, soloSupervisores, horasTrabajadasController.listarRegistros);

/**
 * @swagger
 * /api/horas-trabajadas/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener registros de horas trabajadas de un usuario específico
 *     tags: [Horas Trabajadas]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Registros del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HorasTrabajadas'
 *       400:
 *         description: ID de usuario requerido
 *       500:
 *         description: Error del servidor
 */
router.get('/usuario/:usuarioId', authMiddleware, soloSupervisores, horasTrabajadasController.obtenerRegistrosPorUsuario);

/**
 * @swagger
 * /api/horas-trabajadas/{registroId}/estado:
 *   put:
 *     summary: Actualizar estado de un registro (aprobación/rechazo)
 *     tags: [Horas Trabajadas]
 *     parameters:
 *       - in: path
 *         name: registroId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, aprobado, rechazado]
 *                 description: Nuevo estado del registro
 *               observaciones:
 *                 type: string
 *                 description: Observaciones del supervisor
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Registro no encontrado
 */
router.put('/:registroId/estado', authMiddleware, soloSupervisores, horasTrabajadasController.actualizarEstado);

/**
 * @swagger
 * /api/horas-trabajadas/usuario/{usuarioId}/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de horas extra por usuario
 *     tags: [Horas Trabajadas]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Estadísticas del período
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRegistros:
 *                   type: integer
 *                 totalHorasTrabajadas:
 *                   type: number
 *                   format: float
 *                 totalHorasExtra:
 *                   type: number
 *                   format: float
 *                 registrosAprobados:
 *                   type: integer
 *                 registrosPendientes:
 *                   type: integer
 *                 registrosRechazados:
 *                   type: integer
 *       400:
 *         description: Parámetros requeridos faltantes
 *       500:
 *         description: Error del servidor
 */
router.get('/usuario/:usuarioId/estadisticas', authMiddleware, soloSupervisores, horasTrabajadasController.obtenerEstadisticas);

/**
 * @swagger
 * /api/horas-trabajadas/calcular:
 *   post:
 *     summary: Calcular horas extra sin guardar (para pruebas)
 *     tags: [Horas Trabajadas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - horaEntrada
 *               - horaSalida
 *             properties:
 *               horaEntrada:
 *                 type: string
 *                 description: Hora de entrada en formato HH:mm
 *                 example: "08:00"
 *               horaSalida:
 *                 type: string
 *                 description: Hora de salida en formato HH:mm
 *                 example: "18:00"
 *     responses:
 *       200:
 *         description: Cálculo realizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 horaEntrada:
 *                   type: string
 *                 horaSalida:
 *                   type: string
 *                 horasTrabajadas:
 *                   type: number
 *                   format: float
 *                 horasExtra:
 *                   type: number
 *                   format: float
 *                 tipoHoraExtra:
 *                   type: string
 *       400:
 *         description: Error en la solicitud
 */
router.post('/calcular', horasTrabajadasController.calcularHorasExtra);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     HorasTrabajadas:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del registro
 *         usuarioId:
 *           type: integer
 *           description: ID del usuario empleado
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha del registro
 *         horaEntrada:
 *           type: string
 *           description: Hora de entrada
 *         horaSalida:
 *           type: string
 *           description: Hora de salida
 *         horasTrabajadas:
 *           type: number
 *           format: float
 *           description: Total de horas trabajadas
 *         horasExtra:
 *           type: number
 *           format: float
 *           description: Horas extra calculadas
 *         tipoHoraExtra:
 *           type: string
 *           description: Tipo de hora extra (Normal, Nocturna, Ninguna)
 *         estado:
 *           type: string
 *           enum: [pendiente, aprobado, rechazado]
 *           description: Estado del registro
 *         observaciones:
 *           type: string
 *           description: Observaciones del registro
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         usuario:
 *           $ref: '#/components/schemas/User'
 */ 