const Especialidad = require('../models/Especialidad');

exports.obtenerEspecialidades = async (req, res) => {
    try {
        const especialidades = await Especialidad.findAll();
        res.status(200).json(especialidades);
    } catch (error) {
        console.error("Error al obtener las especialidades:", error);
        res.status(500).json({ error: 'Error al obtener las especialidades' });
    }
};