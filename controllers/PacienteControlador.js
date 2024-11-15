const { Paciente } = require('../models');

exports.getPacientes = async () => {
    try {
        const paciente = await Paciente.findAll();
        //console.log(paciente.map(paciente => paciente.dataValues));
    } catch (error) {
        console.error('Error al obtener los pacientes:', error);
    }
};

exports.verificarPacientePorDNI = async (req, res) => {
    const dni = req.params.dni;
    //console.log(`Verificando paciente con DNI: ${dni}`);
    try {
        const paciente = await Paciente.findOne({ where: { dni } });
        if (paciente) {
            res.json({ existe: true, nombre: `${paciente.nombre} ${paciente.apellido}`, id: `${paciente.id_paciente}`});
        } else {
            res.json({ existe: false });
        }
    } catch (error) {
        console.error('Error al verificar el paciente:', error);
        res.status(500).json({ error: 'Error al verificar el paciente' });
    }
};