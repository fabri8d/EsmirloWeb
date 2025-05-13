const express = require('express');
const app = express();
const port = 3000;

// Sirve todo lo que esté en la carpeta raíz
app.use(express.static(__dirname));

// Servir imágenes desde la subcarpeta /imagenes
app.use('/imagenes', express.static(__dirname + '/imagenes'));

// Ruta raíz → Login
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/inicio.html');
});

// Ruta para login -> principal
app.get('/principal', (req, res) => {
  res.sendFile(__dirname + '/principal.html');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
