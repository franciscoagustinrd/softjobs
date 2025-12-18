const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {

    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader); 
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
  
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    console.log('Token verificado para:', decoded.email);     
    next();
  } catch (error) {
    console.error('Error verificando token:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    return res.status(401).json({ error: 'Error de autenticación' });
  }
};

module.exports = verifyToken;