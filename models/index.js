// models/index.js
const AgendaTurno = require('./AgendaTurno');
const Clinica = require('./Clinica');
const Dias = require('./Dias');
const Especialidad = require('./Especialidad');
const HistoriaClinica = require('./HistoriaClinica');
const Horario = require('./Horario');
const Medico = require('./Medico');
const MedicoEspecialidad = require('./MedicoEspecialidad');
const Paciente = require('./Paciente');
const Sobreturno = require('./Sobreturno');
const Usuario = require('./Usuario');


// Definir asociaciones de cada modelo
Medico.associations({ Medico, Especialidad, MedicoEspecialidad, Usuario, Horario });
Especialidad.associations({ Medico, Especialidad, MedicoEspecialidad, Usuario, Horario });
MedicoEspecialidad.associations({ Medico, Especialidad, MedicoEspecialidad, Usuario, Horario });

// Exportar los modelos
module.exports = {
  Medico,
  Especialidad,
  MedicoEspecialidad,
  Usuario,
  Horario,
};
