const express = require('express');
const router = express.Router();
const { obtenerEspecialidades } = require('../controllers/EspecialidadControlador');

router.get('/obtenerEspecialidades', obtenerEspecialidades);

module.exports = router;
