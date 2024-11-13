const { DataTypes } = require('sequelize');
const sequelize= require('../config/db');

const Clinica = sequelize.define('Clinica', {
    id_clinica: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'clinicas',
    timestamps:false
});

module.exports= Clinica;