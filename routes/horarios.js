const express = require('express');
const router = express.Router();
const horarioControlador = require('../controllers/HorarioControlador');

router.get('/obtenerHorarios', horarioControlador.obtenerHorarios);

module.exports = router;
