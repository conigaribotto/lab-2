const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./config/db');
const PORT = 3000;
const {Medico, Especialidad, MedicoEspecialidad} = require('./models')
const MedicoControlador = require('./controllers/medicoControlador');

// Sincronizar modelos con la base de datos
sequelize.sync()
    .then(() => {
        console.log("Conectado a la base de datos y modelos sincronizados.");
        MedicoControlador.getMedicos();
    })
    .catch(err => console.error("Error al sincronizar la base de datos:", err));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));
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