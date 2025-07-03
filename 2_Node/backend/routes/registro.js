const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');

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
 *         - usuario
 *         - numRegistro
 *         - cantidadHorasExtra
 *         - estado
 *         - horas
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
 *         usuario:
 *           type: string
 *           example: "juan.perez"
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

module.exports = router;
