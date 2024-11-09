const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Medico = require('./Medico');
const Especialidad = require('./Especialidad');

const MedicoEspecialidad = sequelize.define('MedicoEspecialidad', {
    matricula: {
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
    id_especialidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Especialidad,
            key: 'id_especialidad'
        }
    }
}, {
    tableName: 'medico_especialidad',
    timestamps: false
});

MedicoEspecialidad.belongsTo(Medico, {foreignKey: 'id_medico'});
MedicoEspecialidad.belongsTo(Especialidad, { foreignKey: 'id_especialidad'});

module.exports = MedicoEspecialidad;
