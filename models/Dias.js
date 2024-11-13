const { DataTypes } = require('sequelize');
const sequelize= require('../config/db');
const Horario= require('./Horario');
const HorarioDias = require('./HorarioDias');

const Dias = sequelize.define('Dias', {
    id_dia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_dia: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'dias',
    timestamps:false
});

Dias.associations = (models) =>{
Dias.belongsToMany(models.Horario, { through: HorarioDias, foreignKey: 'id_dia' });
};
module.exports= Dias;