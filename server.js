const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bd-web',
  password: 'usuario123',
  port: 5432,
});

// Middleware para procesar datos JSON
app.use(express.json()); // Esto es necesario para procesar el cuerpo de la solicitud en formato JSON

// Sirve todo lo que esté en la carpeta raíz
app.use(express.static(__dirname));

// Ruta raíz → Login
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/inicio.html');
});

// Ruta para login -> principal
app.get('/principal', (req, res) => {
  res.sendFile(__dirname + '/principal.html');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Ruta de prueba para verificar conexión con PostgreSQL
app.get('/prueba-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error de conexión con la base de datos:', err);
    res.status(500).send('Fallo la conexión a la base de datos');
  }
});

// Agregar productos
app.post('/agregar-producto', async (req, res) => {
  console.log("Solicitud POST recibida");
  const { nombre, descripcion, precio, cantidad, categoria } = req.body;

  if (!nombre || !descripcion || !categoria || isNaN(precio) || isNaN(cantidad) || precio <= 0 || cantidad < 0){
    console.log('Datos recibidos en backend:', req.body);
    console.log("Faltan campos obligatorios");
    return res.status(400).send('Todos los campos son requeridos');
  }

  try {
    console.log("Datos recibidos:", { nombre, descripcion, precio, cantidad, categoria });
    const result = await pool.query(
      'INSERT INTO public.producto (nombre, descripcion, precio, cantidad, categoria) VALUES ($1, $2, $3, $4, $5)',
      [nombre, descripcion, precio, cantidad, categoria]
    );
    res.status(201).send('Producto agregado correctamente');
  } catch (err) {
    console.error('Error insertando el producto', err.stack);
    res.status(500).send('Error al agregar el producto');
  }
});


// Ruta para obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.producto');
    res.json(result.rows);
  } catch (err) {
    console.error('Error ejecutando la consulta', err.stack);
    res.status(500).send('Error en la base de datos');
  }
});
