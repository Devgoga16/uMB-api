// Manejador de errores global
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      mensaje: 'Error de validación',
      errores: message
    });
  }

  // Error de duplicado en Mongoose
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue);
    return res.status(400).json({
      success: false,
      mensaje: `${field} ya existe en la base de datos`
    });
  }

  // Error de CastError de Mongoose (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      mensaje: 'ID inválido'
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    mensaje: error.message || 'Error del servidor',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
