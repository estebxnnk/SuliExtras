const express = require('express');
const router = express.Router();
const Hora = require('../models/Hora');

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
router.get('/', async (req, res) => {
  try {
    const horas = await Hora.findAll();
    res.json(horas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
router.get('/:tipo', async (req, res) => {
  try {
    const hora = await Hora.findOne({ where: { tipo: req.params.tipo } });
    if (!hora) return res.status(404).json({ error: 'Hora no encontrada' });
    res.json(hora);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
router.post('/', async (req, res) => {
  try {
    const nuevaHora = await Hora.create(req.body);
    res.status(201).json(nuevaHora);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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
router.put('/:tipo', async (req, res) => {
  try {
    const hora = await Hora.findOne({ where: { tipo: req.params.tipo } });
    if (!hora) return res.status(404).json({ error: 'Hora no encontrada' });

    await hora.update(req.body);
    res.json(hora);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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
router.delete('/:tipo', async (req, res) => {
  try {
    const deleted = await Hora.destroy({ where: { tipo: req.params.tipo } });
    if (!deleted) return res.status(404).json({ error: 'Hora no encontrada' });
    res.json({ message: 'Hora eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
