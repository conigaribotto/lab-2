const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Especialidad = require('./Especialidad');
const Medico = require('./Medico');

const MedicoEspecialidad = sequelize.define('MedicoEspecialidad', {
    id_especialidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Especialidad,
            key: 'id_especialidad'
        }
    },
    id_medico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Medico,
            key: 'id_medico'
        }
    },
    matricula: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'medico_especialidad',
    timestamps: false
});

MedicoEspecialidad.associations = (models) => {
MedicoEspecialidad.belongsTo(models.Especialidad, { foreignKey: 'id_especialidad'});
MedicoEspecialidad.belongsTo(models.Medico, {foreignKey: 'id_medico'});
};

module.exports = MedicoEspecialidad;