const express = require('express');
const {
  obtenerBots,
  obtenerBot,
  crearBot,
  actualizarBot,
  eliminarBot,
  cambiarEstado,
  obtenerEstadisticas,
  resetearUso
} = require('../controllers/botController');
const { proteger, esAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(proteger);
router.use(esAdmin);

/**
 * @swagger
 * /api/bots:
 *   get:
 *     summary: Obtener todos los bots de WhatsApp
 *     tags: [Bots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de bots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cantidad:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bot'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *   post:
 *     summary: Crear un nuevo bot de WhatsApp
 *     tags: [Bots]
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
 *               - url
 *               - apiKey
 *               - baseDatos
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Bot Ventas
 *               url:
 *                 type: string
 *                 example: https://bot-ventas.miempresa.com
 *               apiKey:
 *                 type: string
 *                 example: sk_live_12345abcdef
 *               baseDatos:
 *                 type: string
 *                 example: bot_ventas_db
 *               email:
 *                 type: string
 *                 format: email
 *                 example: bot@miempresa.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               plan:
 *                 type: object
 *                 required: true
 *                 properties:
 *                   tipo:
 *                     type: string
 *                     enum: [basico, profesional, empresarial]
 *                     example: profesional
 *                   precio:
 *                     type: number
 *                     example: 99.99
 *                   limites:
 *                     type: object
 *                     properties:
 *                       mensajesWhatsApp:
 *                         type: number
 *                         example: 5000
 *                       correos:
 *                         type: number
 *                         example: 2000
 *                   costosExtras:
 *                     type: object
 *                     properties:
 *                       mensajeWhatsApp:
 *                         type: number
 *                         example: 0.05
 *                       correo:
 *                         type: number
 *                         example: 0.02
 *               configuracion:
 *                 type: object
 *                 properties:
 *                   mensajeBienvenida:
 *                     type: string
 *                   timeoutRespuesta:
 *                     type: number
 *                   maxConversaciones:
 *                     type: number
 *     responses:
 *       201:
 *         description: Bot creado exitosamente
 *       400:
 *         description: Nombre duplicado o datos inválidos
 *       401:
 *         description: No autorizado
 */
router.route('/')
  .get(obtenerBots)
  .post(crearBot);

/**
 * @swagger
 * /api/bots/{id}:
 *   get:
 *     summary: Obtener un bot por ID
 *     tags: [Bots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del bot
 *     responses:
 *       200:
 *         description: Bot encontrado
 *       404:
 *         description: Bot no encontrado
 *   put:
 *     summary: Actualizar un bot
 *     tags: [Bots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               url:
 *                 type: string
 *               apiKey:
 *                 type: string
 *               baseDatos:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               plan:
 *                 type: string
 *                 enum: [basico, profesional, empresarial]
 *               estado:
 *                 type: string
 *                 enum: [activo, inactivo, mantenimiento]
 *               configuracion:
 *                 type: object
 *     responses:
 *       200:
 *         description: Bot actualizado exitosamente
 *       404:
 *         description: Bot no encontrado
 *   delete:
 *     summary: Eliminar un bot
 *     tags: [Bots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bot eliminado exitosamente
 *       404:
 *         description: Bot no encontrado
 */
router.route('/:id')
  .get(obtenerBot)
  .put(actualizarBot)
  .delete(eliminarBot);

/**
 * @swagger
 * /api/bots/{id}/estado:
 *   patch:
 *     summary: Cambiar estado del bot
 *     tags: [Bots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *                 enum: [activo, inactivo, mantenimiento]
 *                 example: activo
 *     responses:
 *       200:
 *         description: Estado cambiado exitosamente
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Bot no encontrado
 */
router.patch('/:id/estado', cambiarEstado);

/**
 * @swagger
 * /api/bots/{id}/estadisticas:
 *   get:
 *     summary: Obtener estadísticas y uso del bot
 *     tags: [Bots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estadísticas completas del bot incluyendo límites y costos
 *       404:
 *         description: Bot no encontrado
 */
router.get('/:id/estadisticas', obtenerEstadisticas);

/**
 * @swagger
 * /api/bots/{id}/resetear-uso:
 *   post:
 *     summary: Resetear uso mensual del bot
 *     tags: [Bots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Uso reseteado exitosamente
 *       404:
 *         description: Bot no encontrado
 */
router.post('/:id/resetear-uso', resetearUso);

module.exports = router;
