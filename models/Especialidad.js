const { DataTypes } = require('sequelize');
const sequelize= require('../config/db');
const Medico = require('./Medico');
const MedicoEspecialidad = require('./MedicoEspecialidad.js');

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

Especialidad.associations = (models) => {
Especialidad.belongsToMany(models.Medico, { through: MedicoEspecialidad, foreignKey: 'id_especialidad' });
};
module.exports= Especialidad;