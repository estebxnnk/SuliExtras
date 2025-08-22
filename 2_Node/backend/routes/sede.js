const express = require('express');
const router = express.Router();
const sedeController = require('../controllers/sedeController');
const authMiddleware = require('../middleware/authMiddleware');
const { soloAdministradores } = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Sedes
 *   description: Gestión de sedes y sus horarios
 */

/**
 * @swagger
 * /api/sedes:
 *   post:
 *     summary: Crear una nueva sede
 *     tags: [Sedes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - direccion
 *               - ciudad
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la sede
 *                 example: "Sede Principal"
 *               direccion:
 *                 type: string
 *                 description: Dirección completa de la sede
 *                 example: "Calle 123 #45-67"
 *               ciudad:
 *                 type: string
 *                 description: Ciudad donde se encuentra la sede
 *                 example: "Bogotá"
 *               telefono:
 *                 type: string
 *                 description: Teléfono de contacto
 *                 example: "3001234567"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de contacto
 *                 example: "sede@empresa.com"
 *               descripcion:
 *                 type: string
 *                 description: Descripción adicional
 *               horarios:
 *                 type: array
 *                 description: Lista de horarios asociados a la sede
 *                 items:
 *                   type: object
 *                   required:
 *                     - nombre
 *                     - tipo
 *                     - horaEntrada
 *                     - horaSalida
 *                     - horasJornada
 *                     - horasJornadaReal
 *                     - tiempoAlmuerzo
 *                     - diasTrabajados
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       maxLength: 100
 *                       description: Nombre del horario
 *                       example: "Horario Normal"
 *                     tipo:
 *                       type: string
 *                       enum: ["normal", "nocturno", "especial", "festivo"]
 *                       default: "normal"
 *                       description: Tipo de horario
 *                       example: "normal"
 *                     horaEntrada:
 *                       type: string
 *                       format: time
 *                       description: Hora de entrada
 *                       example: "08:00"
 *                     horaSalida:
 *                       type: string
 *                       format: time
 *                       description: Hora de salida
 *                       example: "17:00"
 *                     horasJornada:
 *                       type: number
 *                       format: float
 *                       description: Horas de la jornada normal
 *                       example: 8.0
 *                     horasJornadaReal:
 *                       type: number
 *                       format: float
 *                       description: Horas reales trabajadas (horasJornada - tiempo de almuerzo)
 *                       example: 7.0
 *                     tiempoAlmuerzo:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 180
 *                       default: 60
 *                       description: Tiempo de almuerzo en minutos
 *                       example: 60
 *                     diasTrabajados:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 7
 *                       default: 5
 *                       description: Cantidad de días trabajados en la semana
 *                       example: 5
 *                     activo:
 *                       type: boolean
 *                       default: true
 *                       description: Si el horario está activo
 *                       example: true
 *                     descripcion:
 *                       type: string
 *                       description: Descripción adicional del horario
 *                       example: "Horario estándar de oficina"
 *     responses:
 *       201:
 *         description: Sede creada exitosamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.post('/', authMiddleware, soloAdministradores, sedeController.crearSede);

/**
 * @swagger
 * /api/sedes:
 *   get:
 *     summary: Obtener todas las sedes
 *     tags: [Sedes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sedes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sede'
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, sedeController.listarSedes);

/**
 * @swagger
 * /api/sedes/buscar:
 *   get:
 *     summary: Buscar sedes por criterios
 *     tags: [Sedes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre de la sede
 *       - in: query
 *         name: ciudad
 *         schema:
 *           type: string
 *         description: Ciudad de la sede
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *         description: Estado activo/inactivo
 *     responses:
 *       200:
 *         description: Sedes que coinciden con los criterios
 *       500:
 *         description: Error del servidor
 */
router.get('/buscar', authMiddleware, sedeController.buscarSedes);

/**
 * @swagger
 * /api/sedes/{sedeId}:
 *   get:
 *     summary: Obtener una sede por ID
 *     tags: [Sedes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sedeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sede
 *     responses:
 *       200:
 *         description: Sede encontrada
 *       404:
 *         description: Sede no encontrada
 */
router.get('/:sedeId', authMiddleware, sedeController.obtenerSedePorId);

/**
 * @swagger
 * /api/sedes/{sedeId}:
 *   put:
 *     summary: Actualizar una sede
 *     tags: [Sedes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sedeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sede
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sede'
 *     responses:
 *       200:
 *         description: Sede actualizada exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Sede no encontrada
 */
router.put('/:sedeId', authMiddleware, soloAdministradores, sedeController.actualizarSede);

/**
 * @swagger
 * /api/sedes/{sedeId}:
 *   delete:
 *     summary: Eliminar una sede
 *     tags: [Sedes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sedeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sede
 *     responses:
 *       200:
 *         description: Sede eliminada exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Sede no encontrada
 */
router.delete('/:sedeId', authMiddleware, soloAdministradores, sedeController.eliminarSede);

/**
 * @swagger
 * /api/sedes/{sedeId}/estado:
 *   patch:
 *     summary: Cambiar estado de una sede
 *     tags: [Sedes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sedeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sede
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
 *                 type: boolean
 *                 description: Nuevo estado de la sede
 *     responses:
 *       200:
 *         description: Estado cambiado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Sede no encontrada
 */
router.patch('/:sedeId/estado', authMiddleware, soloAdministradores, sedeController.cambiarEstadoSede);

/**
 * @swagger
 * /api/sedes/{sedeId}/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de una sede
 *     tags: [Sedes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sedeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sede
 *     responses:
 *       200:
 *         description: Estadísticas de la sede
 *       404:
 *         description: Sede no encontrada
 */
router.get('/:sedeId/estadisticas', authMiddleware, sedeController.obtenerEstadisticasSede);

/**
 * @swagger
 * /api/sedes/{sedeId}/horarios:
 *   post:
 *     summary: Agregar un horario a una sede existente
 *     tags: [Sedes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sedeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sede
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - tipo
 *               - horaEntrada
 *               - horaSalida
 *               - horasJornada
 *               - horasJornadaReal
 *               - tiempoAlmuerzo
 *               - diasTrabajados
 *             properties:
 *               nombre:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nombre del horario
 *                 example: "Horario Normal"
 *               tipo:
 *                 type: string
 *                 enum: ["normal", "nocturno", "especial", "festivo"]
 *                 description: Tipo de horario
 *                 example: "normal"
 *               horaEntrada:
 *                 type: string
 *                 format: time
 *                 description: Hora de entrada
 *                 example: "08:00"
 *               horaSalida:
 *                 type: string
 *                 format: time
 *                 description: Hora de salida
 *                 example: "17:00"
 *               horasJornada:
 *                 type: number
 *                 format: float
 *                 description: Horas de la jornada normal
 *                 example: 8.0
 *               horasJornadaReal:
 *                 type: number
 *                 format: float
 *                 description: Horas reales trabajadas
 *                 example: 7.0
 *               tiempoAlmuerzo:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 180
 *                 description: Tiempo de almuerzo en minutos
 *                 example: 60
 *               diasTrabajados:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 7
 *                 description: Días trabajados en la semana
 *                 example: 5
 *               activo:
 *                 type: boolean
 *                 default: true
 *                 description: Si el horario está activo
 *                 example: true
 *               descripcion:
 *                 type: string
 *                 description: Descripción adicional
 *                 example: "Horario estándar de oficina"
 *     responses:
 *       200:
 *         description: Horario agregado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Sede no encontrada
 */
router.post('/:sedeId/horarios', authMiddleware, soloAdministradores, sedeController.agregarHorario);

/**
 * @swagger
 * /api/sedes/{sedeId}/horarios/{horarioIndex}:
 *   delete:
 *     summary: Eliminar un horario de una sede
 *     tags: [Sedes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sedeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sede
 *       - in: path
 *         name: horarioIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: Índice del horario en el array (0-based)
 *     responses:
 *       200:
 *         description: Horario eliminado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Sede o horario no encontrado
 */
router.delete('/:sedeId/horarios/:horarioIndex', authMiddleware, soloAdministradores, sedeController.eliminarHorario);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Sede:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la sede
 *         nombre:
 *           type: string
 *           description: Nombre de la sede
 *         direccion:
 *           type: string
 *           description: Dirección completa
 *         ciudad:
 *           type: string
 *           description: Ciudad de la sede
 *         telefono:
 *           type: string
 *           description: Teléfono de contacto
 *         email:
 *           type: string
 *           format: email
 *           description: Email de contacto
 *         estado:
 *           type: boolean
 *           description: Estado activo/inactivo
 *         descripcion:
 *           type: string
 *           description: Descripción adicional
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         horarios:
 *           type: array
 *           description: Array de horarios para la sede
 *           items:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *               horaEntrada:
 *                 type: string
 *               horaSalida:
 *                 type: string
 *               activo:
 *                 type: boolean
 *         usuarios:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 */