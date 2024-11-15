const express = require('express');
const router = express.Router();
const Medico = require('../models/Medico');
const Especialidad = require('../models/Especialidad');
const MedicoEspecialidad = require('../models/MedicoEspecialidad');

// Ruta principal
router.get('/', (req, res) => {
  res.render('index');
});

// Ruta para la vista de administrador
router.get('/administrador', async (req, res) => {
  try {
    const medicos = await Medico.findAll();
    res.render('administrador', { medicos });
  } catch (error) {
    console.error('Error al obtener los médicos:', error);
    res.status(500).send('Error al obtener los médicos');
  }
});

// Ruta para mostrar el formulario de alta de médico
router.get('/administrador/alta-medico', (req, res) => {
  res.render('alta-medico');
});

// Ruta para procesar el formulario de alta de médico
router.post('/administrador/alta-medico', async (req, res) => {
  try {
    const { nombre, apellido, dni, id_usuario } = req.body;
    await Medico.create({ nombre, apellido, dni, id_usuario });
    res.redirect('/administrador');
  } catch (error) {
    console.error('Error al crear el médico:', error);
    res.status(500).send('Error al crear el médico');
  }
});

// Ruta para mostrar el formulario de edición de médico
router.get('/administrador/editar-medico/:id', async (req, res) => {
  try {
    const medico = await Medico.findByPk(req.params.id);
    if (medico) {
      res.render('editar-medico', { medico });
    } else {
      res.status(404).send('Médico no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener el médico:', error);
    res.status(500).send('Error al obtener los médicos');
  }
});

// Ruta para procesar el formulario de edición de médico
router.post('/administrador/editar-medico/:id', async (req, res) => {
  try {
    const { nombre, apellido, dni, id_usuario } = req.body;
    const id_medico = req.params.id;

    if (!nombre || !apellido || !dni || !id_usuario) {
      return res.status(400).send('Faltan datos en el formulario');
    }

    const medico = await Medico.findByPk(id_medico);
    if (medico) {
      await medico.update({ nombre, apellido, dni, id_usuario });
      res.redirect('/administrador');
    } else {
      res.status(404).send('Médico no encontrado');
    }
  } catch (error) {
    console.error('Error al actualizar el médico:', error);
    res.status(500).send('Error al actualizar el médico');
  }
});

// Ruta para eliminar un médico
router.post('/administrador/eliminar-medico', async (req, res) => {
    try {
      const { id_medico } = req.body;
  
      // Primero, eliminar las relaciones del médico con especialidades
      await MedicoEspecialidad.destroy({
        where: { id_medico }
      });
  
      // Ahora, eliminar al médico
      const medico = await Medico.findByPk(id_medico);
      if (medico) {
        await medico.destroy(); // Eliminar al médico de la base de datos
        res.render('eliminar-medico', { success: true, medico });
      } else {
        res.status(404).send('Médico no encontrado');
      }
    } catch (error) {
      console.error('Error al eliminar el médico:', error);
      res.status(500).send('Error al eliminar el médico');
    }
  });
  

// Ruta para gestionar especialidades del médico
router.get('/administrador/gestionar-especialidad/:id', async (req, res) => {
  try {
    const medicoId = req.params.id;
    const medico = await Medico.findByPk(medicoId, {
      include: {
        model: Especialidad,
        as: 'especialidades' // Usamos el alias correcto de la relación
      }
    });

    if (medico) {
      const especialidadesMedico = await medico.getEspecialidades(); // Obtenemos las especialidades asociadas
      const especialidadesDisponibles = await Especialidad.findAll(); // Cargamos todas las especialidades disponibles
      res.render('gestionar-especialidad', {
        medico,
        especialidadesMedico,
        especialidadesDisponibles
      });
    } else {
      res.status(404).send('Médico no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener el médico o sus especialidades:', error);
    res.status(500).send('Error al obtener el médico o sus especialidades');
  }
});

// Ruta para eliminar una especialidad de un médico
router.post('/administrador/eliminar-especialidad/:id_medico', async (req, res) => {
  try {
    const { id_especialidad } = req.body;
    const medicoId = req.params.id_medico;

    const medico = await Medico.findByPk(medicoId);
    if (medico) {
      // Eliminar la relación de la tabla intermedia MedicoEspecialidad
      await MedicoEspecialidad.destroy({
        where: {
          id_medico: medicoId,
          id_especialidad: id_especialidad
        }
      });
      res.redirect(`/administrador/gestionar-especialidad/${medicoId}`);
    } else {
      res.status(404).send('Médico no encontrado');
    }
  } catch (error) {
    console.error('Error al eliminar la especialidad:', error);
    res.status(500).send('Error al eliminar la especialidad');
  }
});

// Ruta para agregar una especialidad al médico
router.post('/administrador/agregar-especialidad/:id_medico', async (req, res) => {
  try {
    const { id_especialidad } = req.body;
    const medicoId = req.params.id_medico;
    
    const medico = await Medico.findByPk(medicoId);
    const especialidad = await Especialidad.findByPk(id_especialidad);
    
    if (medico && especialidad) {
      // Insertamos manualmente en la tabla intermedia MedicoEspecialidad
      await MedicoEspecialidad.create({
        id_medico: medico.id_medico,
        id_especialidad: especialidad.id_especialidad
      });
      res.redirect(`/administrador/gestionar-especialidad/${medicoId}`);
    } else {
      res.status(404).send('Médico o especialidad no encontrados');
    }
  } catch (error) {
    console.error('Error al agregar la especialidad:', error);
    res.status(500).send('Error al agregar la especialidad');
  }
});

module.exports = router;
