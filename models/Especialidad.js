const { DataTypes } = require('sequelize');
const sequelize= require('../config/db');

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

module.exports= Especialidad;