const { Horario, Medico, Especialidad, Clinica, Dias} = require('../models');
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

exports.obtenerHorarios = async (req, res) => {
    try {
        const { id_especialidad, id_medico } = req.query;

        // Se construye la condición de filtrado
        const whereConditions = {
            id_especialidad: id_especialidad
        };

        // Si se especifica el id_medico, se agrega al filtro
        if (id_medico) {
            whereConditions.id_medico = id_medico;
        }

        // Consultamos los horarios con los filtros
        const horarios = await Horario.findAll({
            where: whereConditions,
            include: [
                { model: Medico },
                { model: Especialidad },
                { model: Clinica },
                { model: Dias, through: { attributes: [] } } // Solo los días asociados, sin columnas intermedias
            ]
        });

        // Devolvemos los resultados
        return res.json(horarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los horarios' });
    }
};
