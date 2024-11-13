const { Horario, Dias} = require('../models');
const sequelize = require('../config/db');

exports.crearHorario = async (datosHorario, dias) => {
    const transaction = await sequelize.transaction();
    try {
        // Crear horario
        const nuevoHorario = await Horario.create(datosHorario, { transaction });

        //Asociams días al horario
        const diasAsociados = await Dias.findAll({
            where: {
                id_dia: dias
            }
        });

        await nuevoHorario.addDias(diasAsociados, { transaction });

        //confirmar transeccion
        await transaction.commit();
        console.log('Horario creado exitosamente y días asociados.');
        return nuevoHorario.dataValues;
        
        //Manejo de errores
    } catch (error) {
        await transaction.rollback();  // Para revertir cambios si hay error
        console.error('Error al crear el horario:', error);
        throw error;
    }
};
