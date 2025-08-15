const express = require('express');
const router = express.Router();
const horarioSedeController = require('../controllers/horarioSedeController');
const authMiddleware = require('../middleware/authMiddleware');
const { soloAdministradores } = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Horarios de Sede
 *   description: Gestión de horarios específicos de cada sede
 */

/**
 * @swagger
 * /api/horarios-sede:
 *   post:
 *     summary: Crear un nuevo horario para una sede
 *     tags: [Horarios de Sede]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sedeId
 *               - nombre
 *               - horaEntrada
 *               - horaSalida
 *             properties:
 *               sedeId:
 *                 type: integer
 *                 description: ID de la sede
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 description: Nombre del horario
 *                 example: "Horario Normal"
 *               tipo:
 *                 type: string
 *                 enum: [normal, nocturno, especial, festivo]
 *                 default: normal
 *                 description: Tipo de horario
 *               horaEntrada:
 *                 type: string
 *                 description: Hora de entrada en formato HH:mm
 *                 example: "08:00"
 *               horaSalida:
 *                 type: string
 *                 description: Hora de salida en formato HH:mm
 *                 example: "17:00"
 *               tiempoAlmuerzo:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 180
 *                 description: Tiempo de almuerzo en minutos (opcional)
 *                 example: 60
 *               diasTrabajados:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 7
 *                 description: Días trabajados en la semana para este horario (opcional)
 *                 example: 5
 *               descripcion:
 *                 type: string
 *                 description: Descripción adicional
 *     responses:
 *       201:
 *         description: Horario creado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.post('/', authMiddleware, soloAdministradores, horarioSedeController.crearHorario);

/**
 * @swagger
 * /api/horarios-sede/sede/{sedeId}:
 *   get:
 *     summary: Obtener horarios de una sede
 *     tags: [Horarios de Sede]
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
 *         description: Lista de horarios de la sede
 *       404:
 *         description: Sede no encontrada
 */
router.get('/sede/:sedeId', authMiddleware, horarioSedeController.obtenerHorariosPorSede);

/**
 * @swagger
 * /api/horarios-sede/sede/{sedeId}/semanal:
 *   get:
 *     summary: Obtener horario semanal de una sede
 *     tags: [Horarios de Sede]
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
 *         description: Horario semanal organizado por días
 *       404:
 *         description: Sede no encontrada
 */
router.get('/sede/:sedeId/semanal', authMiddleware, horarioSedeController.obtenerHorarioSemanal);

/**
 * @swagger
 * /api/horarios-sede/{horarioId}:
 *   put:
 *     summary: Actualizar un horario
 *     tags: [Horarios de Sede]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: horarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HorarioSede'
 *     responses:
 *       200:
 *         description: Horario actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Horario no encontrado
 */
router.put('/:horarioId', authMiddleware, soloAdministradores, horarioSedeController.actualizarHorario);

/**
 * @swagger
 * /api/horarios-sede/{horarioId}:
 *   delete:
 *     summary: Eliminar un horario
 *     tags: [Horarios de Sede]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: horarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario
 *     responses:
 *       200:
 *         description: Horario eliminado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Horario no encontrado
 */
router.delete('/:horarioId', authMiddleware, soloAdministradores, horarioSedeController.eliminarHorario);

/**
 * @swagger
 * /api/horarios-sede/{horarioId}/estado:
 *   patch:
 *     summary: Cambiar estado de un horario
 *     tags: [Horarios de Sede]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: horarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activo
 *             properties:
 *               activo:
 *                 type: boolean
 *                 description: Nuevo estado del horario
 *     responses:
 *       200:
 *         description: Estado cambiado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Horario no encontrado
 */
router.patch('/:horarioId/estado', authMiddleware, soloAdministradores, horarioSedeController.cambiarEstadoHorario);

/**
 * @swagger
 * /api/horarios-sede/sede/{sedeId}/por-defecto:
 *   post:
 *     summary: Crear horarios por defecto para una sede
 *     tags: [Horarios de Sede]
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               horaEntrada:
 *                 type: string
 *                 description: Hora de entrada por defecto
 *                 example: "08:00"
 *               horaSalida:
 *                 type: string
 *                 description: Hora de salida por defecto
 *                 example: "17:00"
 *               tiempoAlmuerzo:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 180
 *                 description: Tiempo de almuerzo por defecto en minutos (opcional)
 *                 example: 60
 *               diasTrabajados:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 7
 *                 description: Días trabajados por defecto en la semana (opcional)
 *                 example: 5
 *     responses:
 *       201:
 *         description: Horarios por defecto creados exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Sede no encontrada
 */
router.post('/sede/:sedeId/por-defecto', authMiddleware, soloAdministradores, horarioSedeController.crearHorariosPorDefecto);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     HorarioSede:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del horario
 *         sedeId:
 *           type: integer
 *           description: ID de la sede
 *         nombre:
 *           type: string
 *           description: Nombre del horario
 *         tipo:
 *           type: string
 *           enum: [normal, nocturno, especial, festivo]
 *           description: Tipo de horario
 *         horaEntrada:
 *           type: string
 *           description: Hora de entrada
 *         horaSalida:
 *           type: string
 *           description: Hora de salida
 *         horasJornada:
 *           type: number
 *           format: float
 *           description: Horas base de la jornada (horaSalida - horaEntrada)
 *         horasJornadaReal:
 *           type: number
 *           format: float
 *           description: Horas reales trabajadas (horasJornada - tiempo de almuerzo)
 *         tiempoAlmuerzo:
 *           type: integer
 *           description: Tiempo de almuerzo en minutos
 *         diasTrabajados:
 *           type: integer
 *           description: Días trabajados en la semana para este horario
 *         activo:
 *           type: boolean
 *           description: Si el horario está activo
 *         descripcion:
 *           type: string
 *           description: Descripción adicional
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         sede:
 *           $ref: '#/components/schemas/Sede'
 */