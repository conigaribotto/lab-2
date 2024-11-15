const { DataTypes } = require('sequelize');
const sequelize= require('../config/db');
const Usuario = require('./Usuario');
const Especialidad = require('./Especialidad');
const MedicoEspecialidad = require('./MedicoEspecialidad');
const Horario = require('./Horario');

const Medico = sequelize.define('Medico', {
    id_medico: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dni: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        }
    }
}, {
    tableName: 'medicos',
    timestamps:false
});

Medico.associations= (models) => {
Medico.belongsTo(models.Usuario, {foreignKey: 'id_usuario'});
Medico.belongsToMany(models.Especialidad, { through: MedicoEspecialidad, foreignKey: 'id_medico' });
Medico.hasMany(models.Horario, { foreignKey: 'id_medico' });
};

module.exports= Medico;