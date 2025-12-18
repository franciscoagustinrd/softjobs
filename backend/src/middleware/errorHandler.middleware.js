const errorHandler = (err, req, res, next) => {
  console.error('🔴 Error:', err.message);
  
  if (err.code === '23505') { 
    return res.status(409).json({ 
      error: 'El email ya está registrado',
      code: 'EMAIL_EXISTS'
    });
  }
  
  if (err.code === '23502') { 
    return res.status(400).json({ 
      error: 'Faltan campos requeridos',
      code: 'MISSING_FIELDS' 
    });
  }
  
  if (err.code === '23503') { 
    return res.status(400).json({ 
      error: 'Referencia inválida',
      code: 'INVALID_REFERENCE'
    });
  }
  
  // JWT errores
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: 'Token expirado', 
      code: 'TOKEN_EXPIRED'
    });
  }
  
  if (err.message && err.message.includes('requeridos')) {
    return res.status(400).json({ 
      error: err.message,
      code: 'VALIDATION_ERROR'
    });
  }
  

  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(statusCode).json({
    error: 'Error interno del servidor',
    ...(isDevelopment && { 
      message: err.message,
      stack: err.stack 
    }),
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;