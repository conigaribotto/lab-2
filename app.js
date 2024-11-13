const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./config/db');
const PORT = 3000;

// Definir uso de PUG y en que carpeta estan
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos desde "public"
app.use(express.static(path.join(__dirname, 'public')));

const indexRoutes = require('./routes/index');

app.use('/', indexRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});































/* ///////// Agregar Horarios
const HorarioControlador = require('./controllers/HorarioControlador');
const datosHorario = {
    id_medico: 3,           // ID de un médico existente en la base de datos
    id_clinica: 1,          // ID de una clínica existente
    id_especialidad: 1,     // ID de una especialidad existente
    hora_inicio: '08:00:00',// Hora de inicio del turno
    hora_fin: '12:00:00',   // Hora de fin del turno
    fecha_inicio: '2024-11-15', // Fecha de inicio del horario
    fecha_fin: '2024-12-15',    // Fecha de fin del horario
    duracion: 30,           // Duración de cada turno en minutos
    cant_sobreturnos: 2,    // Cantidad de sobreturnos permitidos
    estado: 1               // Estado del horario (1 = activo)
};
const dias = [1, 3, 5];


(async () => {
    try {
        const nuevoHorario = await HorarioControlador.crearHorario(datosHorario, dias);
        console.log('Horario creado exitosamente:', nuevoHorario);
    } catch (error) {
        console.error('Error al crear el horario:', error);
    }
})();
*/