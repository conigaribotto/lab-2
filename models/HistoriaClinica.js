const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paciente = require('./Paciente');
const Medico = require('./Medico');

const HistoriaClinica = sequelize.define('HistoriaClinica', {
    id_historia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },    
    id_paciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Paciente,
            key: 'id_paciente'
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
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    evolucion: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    tableName: 'historias_clinicas',
    timestamps: false
});

HistoriaClinica.associations = (models) =>{
HistoriaClinica.belongsTo(models.Medico, { foreignKey: 'id_medico' });
HistoriaClinica.belongsTo(models.Paciente, { foreignKey: 'id_paciente' });
};
module.exports = HistoriaClinica;