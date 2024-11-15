const express = require('express');
const router = express.Router();
const PacienteControlador = require('../controllers/PacienteControlador');

router.get('/verificar/:dni', PacienteControlador.verificarPacientePorDNI);

module.exports = router;
