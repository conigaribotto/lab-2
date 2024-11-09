const { DataTypes } = require('sequelize');
const sequelize= require('../config/db');
const Paciente = require('./Paciente');
const AgendaTurno = require('./AgendaTurno');

const Sobreturno = sequelize.define('Sobreturno', {
    id_sobreturno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_turno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AgendaTurno,
            key: 'id_turno'
        }
    },
    id_paciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Paciente,
            key: 'id_paciente'
        }
    }    
}, {
    tableName: 'agenda_turnos',
    timestamps:false
});

Sobreturno.belongsTo(AgendaTurno, {foreignKey: 'id_turno'});
Sobreturno.belongsTo(Paciente, {foreignKey: 'id_paciente'});

module.exports= Sobreturno;