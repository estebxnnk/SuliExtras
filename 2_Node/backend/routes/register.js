const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@ejemplo.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               rolId:
 *                 type: integer
 *                 example: 1
 *               persona:
 *                 type: object
 *                 properties:
 *                   tipoDocumento:
 *                     type: string
 *                     example: "CC"
 *                   numeroDocumento:
 *                     type: string
 *                     example: "123456789"
 *                   nombres:
 *                     type: string
 *                     example: "Juan"
 *                   apellidos:
 *                     type: string
 *                     example: "Pérez"
 *                   correo:
 *                     type: string
 *                     example: "usuario@ejemplo.com"
 *                   fechaNacimiento:
 *                     type: string
 *                     format: date
 *                     example: "1990-01-01"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', registerController.registrarUsuario);

module.exports = router; 