const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rutas - verificar JWT
exports.proteger = async (req, res, next) => {
  let token;

  // Verificar si el token existe en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      mensaje: 'No autorizado. Token no proporcionado' 
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    req.usuario = await User.findById(decoded.id).select('-password');
    
    if (!req.usuario) {
      return res.status(401).json({ 
        success: false,
        mensaje: 'Usuario no encontrado' 
      });
    }

    if (!req.usuario.activo) {
      return res.status(401).json({ 
        success: false,
        mensaje: 'Usuario inactivo' 
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      mensaje: 'Token inválido o expirado' 
    });
  }
};

// Verificar rol de administrador
exports.esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ 
      success: false,
      mensaje: 'Acceso denegado. Se requieren permisos de administrador' 
    });
  }
  next();
};
