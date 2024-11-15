const AgendaTurno = require('../models/AgendaTurno');
const Medico = require('../models/Medico');
const Paciente = require('../models/Paciente');
const Clinica = require('../models/Clinica');
const Especialidad = require('../models/Especialidad');

exports.agendarTurno = async (req, res) => {
    try {
        const { id_medico, id_clinica, id_especialidad, id_paciente, fecha, hora_inicio, hora_fin } = req.body;

        // Validar que todos los campos sean proporcionados
        if (!id_medico || !id_clinica || !id_especialidad || !id_paciente || !fecha || !hora_inicio || !hora_fin) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Crear el nuevo turno
        const nuevoTurno = await AgendaTurno.create({
            id_medico,
            id_clinica,
            id_especialidad,
            id_paciente,
            fecha,
            hora_inicio,
            hora_fin,
            estado: 1 
        });

        // Responder con el turno creado
        res.status(201).json({ message: 'Turno agendado con éxito', turno: nuevoTurno });
    } catch (error) {
        console.error('Error al agendar el turno:', error);
        res.status(500).json({ error: 'Error al agendar el turno' });
    }
};

exports.obtenerTurnos = async (req, res) => {
    try {
        const turnos = await AgendaTurno.findAll({
            include: [
                { model: Medico },
                { model: Paciente },
                { model: Clinica },
                { model: Especialidad }
            ]
        });

        res.status(200).json(turnos);
    } catch (error) {
        console.error('Error al obtener los turnos:', error);
        res.status(500).json({ error: 'Error al obtener los turnos' });
    }
};

