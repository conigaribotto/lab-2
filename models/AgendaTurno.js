const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paciente = require('./Paciente');
const Clinica = require('./Clinica');
const Medico = require('./Medico');
const Especialidad = require('./Especialidad');

const AgendaTurno = sequelize.define('AgendaTurno', {
    id_turno: {
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
    id_clinica: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Clinica,
            key: 'id_clinica'
        }
    },
    id_especialidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Especialidad,
            key: 'id_especialidad'
        }
    },
    id_paciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Paciente,
            key: 'id_paciente'
        }
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'agenda_turnos',
    timestamps: false
});

AgendaTurno.associations = (models) => {
AgendaTurno.belongsTo(models.Medico, { foreignKey: 'id_medico' });
AgendaTurno.belongsTo(models.Clinica, { foreignKey: 'id_clinica' });
AgendaTurno.belongsTo(models.Especialidad, { foreignKey: 'id_especialidad' });
AgendaTurno.belongsTo(models.Paciente, { foreignKey: 'id_paciente' });
};
module.exports = AgendaTurno;