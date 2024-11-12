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
const setAssociations = () => {
AgendaTurno.associations({Medico, Clinica, Especialidad, Paciente});
Dias.associations({Horario});
Especialidad.associations({ Medico, MedicoEspecialidad});
HistoriaClinica.associations({Medico, Paciente});
Horario.associations({Medico, Clinica, Especialidad, Dias});
Medico.associations({ Especialidad, MedicoEspecialidad, Usuario, Horario });
MedicoEspecialidad.associations({ Medico, Especialidad, Usuario, Horario });
Paciente.associations({Usuario});
Sobreturno.associations({AgendaTurno, Paciente});
};

setAssociations();


// Exportar los modelos
module.exports = {
  AgendaTurno, Dias, HistoriaClinica, Paciente, Sobreturno, Clinica,
  Medico,
  Especialidad,
  MedicoEspecialidad,
  Usuario,
  Horario,
};
