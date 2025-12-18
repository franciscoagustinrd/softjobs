const express = require('express');
const router = express.Router();

const simpleVerify = (req, res, next) => {
  console.log('Token recibido:', req.headers.authorization);
  req.user = { email: 'test@test.com' }; 
  next();
};
router.post('/', (req, res) => {
  console.log('Registro recibido:', req.body);
  res.json({ 
    message: 'Usuario registrado exitosamente',
    token: 'jwt-simulado-para-pruebas'
  });
});
router.get('/', simpleVerify, (req, res) => {
  res.json({
    email: req.user.email,
    nombre: 'Usuario de prueba',
    id: 1
  });
});

module.exports = router;