const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Horario = require('./Horario');
const Dias = require('./Dias');

const HorarioDias = sequelize.define('HorarioDias', {
    id_horario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Horario,
            key: 'id_horario'
        }
    },
    id_dia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Dias,
            key: 'id_dia'
        }
    },
}, {
    tableName: 'horarios_dias',
    timestamps: false
});

HorarioDias.associations = (models) => {
    HorarioDias.belongsTo(models.Horario, { foreignKey: 'id_horario' });
    HorarioDias.belongsTo(models.Dias, { foreignKey: 'id_dia' });
};

module.exports = HorarioDias;