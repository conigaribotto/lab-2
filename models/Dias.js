const { DataTypes } = require('sequelize');
const sequelize= require('../config/db');
const Horario= require('./Horario');

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
Dias.belongsToMany(models.Horario, { through: 'horarios_dias', foreignKey: 'id_dia' });
};
module.exports= Dias;