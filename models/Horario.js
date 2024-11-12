const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Medico = require('./Medico');
const Especialidad = require('./Especialidad');
const Clinica = require('./Clinica');
const Dias = require('./Dias');

const Horario = sequelize.define('Horario', {
    id_horario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_medico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Medico,
            key: 'id_medico'
        }
    },
    id_clinica: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Clinica,
            key: 'id_clinica'
        }
    },
    id_especialidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Especialidad,
            key: 'id_especialidad'
        }
    },
    dias_semana: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: true
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cant_sobreturnos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    }
}, { 
    tableName: 'horarios',
    timestamps: false
});

Horario.associations = (models) =>{
Horario.belongsTo(models.Medico, { foreignKey: 'id_medico' });
Horario.belongsTo(models.Clinica, { foreignKey: 'id_clinica' });
Horario.belongsTo(models.Especialidad, { foreignKey: 'id_especialidad' });
Horario.belongsToMany(models.Dias, { through: 'horarios_dias', foreignKey: 'id_horario' });
};

module.exports = Horario;