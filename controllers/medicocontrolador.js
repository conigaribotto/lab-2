const {Medico} = require('../models');

exports.getMedicos = async () => {
    try {
        const medicos = await Medico.findAll();
        console.log(medicos.map(medico => medico.dataValues));
    } catch (error) {
        console.error('Error al obtener los médicos:', error);
    }
};

