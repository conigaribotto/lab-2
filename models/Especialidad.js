const { DataTypes } = require('sequelize');
const sequelize= require('../config/db');
const Medico = require('./Medico');
const MedicoEspecialidad = require('./MedicoEspecialidad');

const Especialidad = sequelize.define('Especialidad', {
    id_especialidad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'especialidades',
    timestamps:false
});

Especialidad.belongsToMany(Medico, { through: MedicoEspecialidad, foreignKey: 'id_especialidad' });

module.exports= Especialidad;