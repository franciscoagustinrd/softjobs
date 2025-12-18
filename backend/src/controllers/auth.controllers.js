const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const db = req.app.locals.db;
    const result = await db.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    const user = result.rows[0];
    
      const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    // JWT
    const token = jwt.sign(
      { 
        email: user.email,
        id: user.id 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    console.log('🔑 Token generado para:', email);
    console.log('🔑 Token:', token.substring(0, 20) + '...');
    
      res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { login };