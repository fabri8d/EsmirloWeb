// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',                  // El usuario que usás (probablemente 'postgres')
  host: 'localhost',                 // Si estás trabajando local
  database: 'bd-web',        // El nombre que pusiste en pgAdmin
  password: 'usuario123',         // La contraseña que elegiste al instalar PostgreSQL
  port: 5432,                        // Puerto por defecto de PostgreSQL
});

module.exports = pool;
