// auth.route.js
const express = require('express');
const router = express.Router();

// POST /auth/login → Login SIMPLIFICADO
router.post('/login', (req, res) => {
  console.log('Login recibido:', req.body);
  
  // Validación básica
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password requeridos' });
  }
  
  res.json({ 
    token: 'jwt-simulado-para-login',
    user: {
      email: email,
      nombre: 'Usuario Logeado',
      id: 2
    }
  });
});

module.exports = router;