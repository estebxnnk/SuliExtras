const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', usuariosController.obtenerUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID (incluye datos de persona y rol)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', usuariosController.obtenerUsuarioPorId);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Editar un usuario por ID (y su persona asociada)
 *     tags: [Usuarios]
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
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "nuevo@email.com"
 *               password:
 *                 type: string
 *                 example: "nuevaPassword"
 *               rolId:
 *                 type: integer
 *                 example: 2
 *               persona:
 *                 type: object
 *                 properties:
 *                   tipoDocumento:
 *                     type: string
 *                     example: "DNI"
 *                   numeroDocumento:
 *                     type: string
 *                     example: "12345678"
 *                   nombres:
 *                     type: string
 *                     example: "Juan"
 *                   apellidos:
 *                     type: string
 *                     example: "Pérez"
 *                   correo:
 *                     type: string
 *                     example: "juan@email.com"
 *                   fechaNacimiento:
 *                     type: string
 *                     format: date
 *                     example: "1990-01-01"
 *           example:
 *             email: "nuevo@email.com"
 *             rolId: 2
 *             persona:
 *               nombres: "NuevoNombre"
 *               apellidos: "NuevoApellido"
 *     responses:
 *       200:
 *         description: Usuario y persona editados correctamente
 *       400:
 *         description: Error en la solicitud
 */
router.put('/:id', usuariosController.editarUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       400:
 *         description: Error en la solicitud
 */
router.delete('/:id', usuariosController.eliminarUsuario);

module.exports = router; 