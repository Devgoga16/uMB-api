const express = require('express');
const {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/userController');
const { proteger, esAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(proteger);
router.use(esAdmin);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *       500:
 *         description: Error del servidor
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
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
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: María García
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "123456"
 *               rol:
 *                 type: string
 *                 enum: [usuario, admin]
 *                 default: usuario
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Email ya registrado o datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *       500:
 *         description: Error del servidor
 */
router.route('/')
  .get(obtenerUsuarios)
  .post(crearUsuario);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: María García Actualizado
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria.nueva@example.com
 *               rol:
 *                 type: string
 *                 enum: [usuario, admin]
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Email ya registrado o datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.route('/:id')
  .get(obtenerUsuario)
  .put(actualizarUsuario)
  .delete(eliminarUsuario);

module.exports = router;
