const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./config/db');
const PORT = 3000;

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));
// Servir
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Ruta principal para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// ruta calendario
app.get('/calendario.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'calendario.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});