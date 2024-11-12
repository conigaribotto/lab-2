const Medico = require('../models/Medico');

const getMedicos = async () => {
    try {
        const medicos = await Medico.findAll();
        console.log(medicos);
    } catch (error) {
        console.error('Error al obtener los médicos:', error);
    }
};

getMedicos();
