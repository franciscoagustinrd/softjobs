const userModel = require('../models/users.model');
const pool = require('../database/config'); 

const usersControllers = {
  getProfile: async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ 
          error: 'Usuario no encontrado' 
        });
      }

      res.json({
        mensaje: 'Perfil obtenido exitosamente',
        usuario: user
      });

    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { lenguage } = req.body;
      const { id } = req.user;
      const result = await pool.query(
        'UPDATE usuarios SET lenguage = $1 WHERE id = $2 RETURNING id, email, rol, lenguage, created_at',
        [lenguage, id]
      );

      res.json({
        mensaje: 'Perfil actualizado exitosamente',
        usuario: result.rows[0]
      });

    } catch (error) {
      next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      if (req.user.rol !== 'admin') {
        return res.status(403).json({ 
          error: 'No autorizado. Se requiere rol admin' 
        });
      }

      const result = await pool.query(
        'SELECT id, email, rol, lenguage, created_at FROM usuarios ORDER BY created_at DESC'
      );

      res.json({
        mensaje: 'Usuarios obtenidos exitosamente',
        usuarios: result.rows,
        total: result.rowCount
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = usersControllers;