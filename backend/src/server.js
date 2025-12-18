require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.route');     
const userRoutes = require('./routes/users.route');    

const app = express();

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas CORREGIDAS
app.use('/auth', authRoutes);      // /auth/login
app.use('/usuarios', userRoutes);  // /usuarios (POST y GET)

app.get('/', (req, res) => {
  res.json({ message: 'API Soft Jobs' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
});