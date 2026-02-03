const Bot = require('../models/Bot');

// @desc    Obtener todos los bots
// @route   GET /api/bots
// @access  Private/Admin
exports.obtenerBots = async (req, res) => {
  try {
    const bots = await Bot.find().populate('createdBy', 'nombre email');
    
    res.status(200).json({
      success: true,
      cantidad: bots.length,
      data: bots
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al obtener bots',
      error: error.message 
    });
  }
};

// @desc    Obtener un bot por ID
// @route   GET /api/bots/:id
// @access  Private/Admin
exports.obtenerBot = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id).populate('createdBy', 'nombre email');
    
    if (!bot) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Bot no encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      data: bot
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al obtener bot',
      error: error.message 
    });
  }
};

// @desc    Crear bot
// @route   POST /api/bots
// @access  Private/Admin
exports.crearBot = async (req, res) => {
  try {
    const { nombre, url, apiKey, baseDatos, email, password, plan, configuracion } = req.body;

    // Verificar si el bot ya existe
    const botExiste = await Bot.findOne({ nombre });
    if (botExiste) {
      return res.status(400).json({ 
        success: false,
        mensaje: 'Ya existe un bot con ese nombre' 
      });
    }

    // Validar que el plan tenga los campos requeridos
    if (!plan || !plan.precio || !plan.limites || !plan.costosExtras) {
      return res.status(400).json({ 
        success: false,
        mensaje: 'El plan debe incluir: precio, limites (mensajesWhatsApp, correos) y costosExtras (mensajeWhatsApp, correo)' 
      });
    }

    // Crear bot
    const bot = await Bot.create({
      nombre,
      url,
      apiKey,
      baseDatos,
      email,
      password,
      plan,
      configuracion,
      createdBy: req.usuario.id
    });

    res.status(201).json({
      success: true,
      mensaje: 'Bot creado exitosamente',
      data: bot
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al crear bot',
      error: error.message 
    });
  }
};

// @desc    Actualizar bot
// @route   PUT /api/bots/:id
// @access  Private/Admin
exports.actualizarBot = async (req, res) => {
  try {
    const { nombre, url, apiKey, baseDatos, email, password, plan, estado, configuracion } = req.body;

    // Verificar si el bot existe
    let bot = await Bot.findById(req.params.id);
    if (!bot) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Bot no encontrado' 
      });
    }

    // Si se está actualizando el nombre, verificar que no exista
    if (nombre && nombre !== bot.nombre) {
      const nombreExiste = await Bot.findOne({ nombre });
      if (nombreExiste) {
        return res.status(400).json({ 
          success: false,
          mensaje: 'Ya existe un bot con ese nombre' 
        });
      }
    }

    // Actualizar campos
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (url) datosActualizados.url = url;
    if (apiKey) datosActualizados.apiKey = apiKey;
    if (baseDatos) datosActualizados.baseDatos = baseDatos;
    if (email) datosActualizados.email = email;
    if (password) datosActualizados.password = password;
    if (plan) datosActualizados.plan = plan;
    if (estado) datosActualizados.estado = estado;
    if (configuracion) datosActualizados.configuracion = { ...bot.configuracion, ...configuracion };

    bot = await Bot.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true, runValidators: true }
    ).populate('createdBy', 'nombre email');

    res.status(200).json({
      success: true,
      mensaje: 'Bot actualizado exitosamente',
      data: bot
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al actualizar bot',
      error: error.message 
    });
  }
};

// @desc    Eliminar bot
// @route   DELETE /api/bots/:id
// @access  Private/Admin
exports.eliminarBot = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);
    
    if (!bot) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Bot no encontrado' 
      });
    }

    await Bot.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      mensaje: 'Bot eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al eliminar bot',
      error: error.message 
    });
  }
};

// @desc    Cambiar estado del bot
// @route   PATCH /api/bots/:id/estado
// @access  Private/Admin
exports.cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;

    if (!['activo', 'inactivo', 'mantenimiento'].includes(estado)) {
      return res.status(400).json({ 
        success: false,
        mensaje: 'Estado inválido. Debe ser: activo, inactivo o mantenimiento' 
      });
    }

    const bot = await Bot.findById(req.params.id);
    
    if (!bot) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Bot no encontrado' 
      });
    }

    bot.estado = estado;
    await bot.save();

    res.status(200).json({
      success: true,
      mensaje: `Estado del bot cambiado a ${estado}`,
      data: bot
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al cambiar estado del bot',
      error: error.message 
    });
  }
};

// @desc    Obtener estadísticas del bot
// @route   GET /api/bots/:id/estadisticas
// @access  Private/Admin
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);
    const limites = bot.verificarLimites();

    res.status(200).json({
      success: true,
      data: {
        nombre: bot.nombre,
        plan: bot.plan,
        estado: bot.estado,
        estadisticas: bot.estadisticas,
        uso: bot.uso,
        limites: limites,
        costoTotal: bot.plan.precio + limites.whatsapp.costoExtras + limites.correos.costoExtras,
        createdAt: bot.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al obtener estadísticas',
      error: error.message 
    });
  }
};

// @desc    Resetear uso del bot (mensual)
// @route   POST /api/bots/:id/resetear-uso
// @access  Private/Admin
exports.resetearUso = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);
    
    if (!bot) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Bot no encontrado' 
      });
    }

    await bot.resetearUso();

    res.status(200).json({
      success: true,
      mensaje: 'Uso del bot reseteado exitosamente',
      data: {
        uso: bot.uso
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al resetear uso del bot',
      error: error.message 
    });
  }
};
