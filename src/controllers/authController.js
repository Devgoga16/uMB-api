const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Registrar usuario
// @route   POST /api/auth/registro
// @access  Public
exports.registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ 
        success: false,
        mensaje: 'El email ya está registrado' 
      });
    }

    // Crear usuario
    const usuario = await User.create({
      nombre,
      email,
      password,
      rol: rol || 'usuario'
    });

    // Generar token
    const token = generarToken(usuario._id);

    res.status(201).json({
      success: true,
      mensaje: 'Usuario registrado exitosamente',
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al registrar usuario',
      error: error.message 
    });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar email y password
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        mensaje: 'Por favor proporcione email y contraseña' 
      });
    }

    // Buscar usuario con password
    const usuario = await User.findOne({ email }).select('+password');
    if (!usuario) {
      return res.status(401).json({ 
        success: false,
        mensaje: 'Credenciales inválidas' 
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({ 
        success: false,
        mensaje: 'Usuario inactivo. Contacte al administrador' 
      });
    }

    // Verificar contraseña
    const passwordCorrecto = await usuario.compararPassword(password);
    if (!passwordCorrecto) {
      return res.status(401).json({ 
        success: false,
        mensaje: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = generarToken(usuario._id);

    res.status(200).json({
      success: true,
      mensaje: 'Login exitoso',
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al iniciar sesión',
      error: error.message 
    });
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
exports.obtenerUsuarioActual = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario.id);
    
    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al obtener usuario',
      error: error.message 
    });
  }
};
