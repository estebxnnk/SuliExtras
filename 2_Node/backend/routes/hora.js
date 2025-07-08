const express = require('express');
const router = express.Router();
const horaController = require('../controllers/horaController');

/**
 * @swagger
 * tags:
 *   name: Horas
 *   description: Gestión de tipos de horas extra y recargos
 */

/**
 * @swagger
 * /api/horas:
 *   get:
 *     summary: Obtener todos los tipos de horas
 *     tags: [Horas]
 *     responses:
 *       200:
 *         description: Lista de horas
 */
router.get('/', horaController.listarHoras);

/**
 * @swagger
 * /api/horas/{tipo}:
 *   get:
 *     summary: Obtener un tipo de hora por su tipo
 *     tags: [Horas]
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hora encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/:tipo', horaController.obtenerHoraPorTipo);

/**
 * @swagger
 * /api/horas:
 *   post:
 *     summary: Crear un nuevo tipo de hora
 *     tags: [Horas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hora'
 *     responses:
 *       201:
 *         description: Hora creada
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', horaController.crearHora);

/**
 * @swagger
 * /api/horas/{tipo}:
 *   put:
 *     summary: Actualizar un tipo de hora
 *     tags: [Horas]
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hora'
 *     responses:
 *       200:
 *         description: Hora actualizada
 *       404:
 *         description: Hora no encontrada
 */
router.put('/:tipo', horaController.actualizarHora);

/**
 * @swagger
 * /api/horas/{tipo}:
 *   delete:
 *     summary: Eliminar un tipo de hora
 *     tags: [Horas]
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hora eliminada
 *       404:
 *         description: Hora no encontrada
 */
router.delete('/:tipo', horaController.eliminarHora);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Hora:
 *       type: object
 *       required:
 *         - tipo
 *         - denominacion
 *         - valor
 *       properties:
 *         tipo:
 *           type: string
 *           example: H.E.D
 *         denominacion:
 *           type: string
 *           example: Hora extra diurna
 *         valor:
 *           type: number
 *           format: float
 *           example: 1.25
 */
