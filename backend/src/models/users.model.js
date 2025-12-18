const pool = require('../database/config');

const userModel = {
  create: async (email, hashedPassword, rol = 'usuario', lenguage = 'es') => {
    const result = await pool.query(
      `INSERT INTO usuarios (email, password, rol, lenguage) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, rol, lenguage, created_at`,
      [email, hashedPassword, rol, lenguage]
    );
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT id, email, password, rol, lenguage FROM usuarios WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  emailExists: async (email) => {
    const result = await pool.query(
      'SELECT 1 FROM usuarios WHERE email = $1',
      [email]
    );
    return result.rows.length > 0;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT id, email, rol, lenguage, created_at FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  findForAuth: async (email) => {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }
};

module.exports = userModel;