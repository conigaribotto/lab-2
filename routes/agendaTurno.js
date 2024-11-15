const express = require('express');
const router = express.Router();
const AgendaTurnoController = require('../controllers/AgendaTurnoControlador');

router.post('/agendar', AgendaTurnoController.agendarTurno);

module.exports = router;
