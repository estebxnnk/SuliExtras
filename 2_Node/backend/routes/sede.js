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
 *           items:
 *             $ref: '#/components/schemas/HorarioSede'
 *         usuarios:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 */ 