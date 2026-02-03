const User = require('../models/User');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      cantidad: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al obtener usuarios',
      error: error.message 
    });
  }
};

// @desc    Obtener un usuario por ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Usuario no encontrado' 
      });
    }

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

// @desc    Crear usuario
// @route   POST /api/users
// @access  Private/Admin
exports.crearUsuario = async (req, res) => {
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

    // Remover password de la respuesta
    usuario.password = undefined;

    res.status(201).json({
      success: true,
      mensaje: 'Usuario creado exitosamente',
      data: usuario
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al crear usuario',
      error: error.message 
    });
  }
};

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, rol, activo } = req.body;

    // Verificar si el usuario existe
    let usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Usuario no encontrado' 
      });
    }

    // Si se está actualizando el email, verificar que no exista
    if (email && email !== usuario.email) {
      const emailExiste = await User.findOne({ email });
      if (emailExiste) {
        return res.status(400).json({ 
          success: false,
          mensaje: 'El email ya está registrado' 
        });
      }
    }

    // Actualizar campos
    usuario = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, email, rol, activo },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      mensaje: 'Usuario actualizado exitosamente',
      data: usuario
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al actualizar usuario',
      error: error.message 
    });
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Usuario no encontrado' 
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      mensaje: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al eliminar usuario',
      error: error.message 
    });
  }
};
