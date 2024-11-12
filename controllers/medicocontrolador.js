const {Medico, Especialidad, MedicoEspecialidad} = require('../models');

const getMedicos = async () => {
    try {
        const medicos = await Medico.findAll();
        console.log(medicos);
    } catch (error) {
        console.error('Error al obtener los médicos:', error);
    }
};

getMedicos();
