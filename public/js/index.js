document.addEventListener('DOMContentLoaded', async function () {
  const calendarEl = document.getElementById('calendar');
  const especialidadSelect = document.getElementById('especialidad');
  const turnosContainer = document.getElementById('turnos-container');

  // Iniciar el calendario
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: [],  // Inicialmente vacío
    eventClick: function (info) {
      // Mostrar los turnos cuando se hace clic en un evento
      const fechaSeleccionada = info.event.start;
      cargarTurnos(fechaSeleccionada);
    }
  });

  // Obtener especialidades y llenar el select
  try {
    const response = await fetch('/especialidades/obtenerEspecialidades');
    const especialidades = await response.json();
    especialidades.forEach(especialidad => {
      const option = document.createElement('option');
      option.value = especialidad.id_especialidad;
      option.textContent = especialidad.especialidad;
      especialidadSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar especialidades:", error);
  }
  // Escuchar cambios en el selector de especialidad
  especialidadSelect.addEventListener('change', function () {
    const especialidadId = especialidadSelect.value;
    if (especialidadId) {
      cargarEventos(especialidadId, calendar);
    } else {
      calendar.removeAllEvents();
    }
  });

  // Renderizar el calendario
  calendar.render();
});


// Calcular la fecha segun el dia de la semana
function calcularFechaConBase(fechaBase, diaSemana) {
  const diasSemana = {
    "domingo": 6,
    "lunes": 0,
    "martes": 1,
    "miercoles": 2,
    "jueves": 3,
    "viernes": 4,
    "sabado": 5
  };

  const dia = fechaBase.getDay();  // Obtiene el día de la semana (0 - Domingo, 1 - Lunes, ...)
  const diaObjetivo = diasSemana[diaSemana];  // El día que queremos encontrar (lunes, martes, etc.)

  // Calcular la diferencia en días
  let diferencia = diaObjetivo - dia;

  // Si el día objetivo es anterior al día de la semana actual, sumamos 7 días
  if (diferencia < 0) {
    diferencia += 7;
  }

  const fecha = new Date(fechaBase);
  fecha.setDate(fechaBase.getDate() + diferencia);  // Ajustamos la fecha
  return fecha;
}

// Función para cargar eventos en el calendario
async function cargarEventos(especialidadId, calendar) {
  const response = await fetch(`/horarios/obtenerHorarios?id_especialidad=${especialidadId}`);
  const horarios = await response.json();

  const eventos = horarios.map(horario => {
    const especialidad = horario.Especialidad ? horario.Especialidad.especialidad : 'Especialidad desconocida';
    const nombreMedico = horario.Medico ? horario.Medico.nombre : 'Medico desconocido';
    const horaInicio = horario.hora_inicio || '';
    const horaFin = horario.hora_fin || '';
    const fechaInicio = new Date(horario.fecha_inicio);
    const fechaFin = new Date(horario.fecha_fin);
    const diasSemana = horario.Dias ? horario.Dias.map(dia => dia.nombre_dia) : [];

    if (horaInicio && horaFin && fechaInicio && fechaFin && diasSemana.length > 0) {
      const eventosDelMedico = diasSemana.map(dia => {
        let fecha = calcularFechaConBase(fechaInicio, dia);

        const eventos = [];
        while (fecha <= fechaFin) {
          const start = `${fecha.toISOString().split('T')[0]}T${horaInicio}`;
          const end = `${fecha.toISOString().split('T')[0]}T${horaFin}`;

          eventos.push({
            title: `${nombreMedico} - ${especialidad}`,
            start: start,
            end: end,
            description: `Especialidad: ${especialidad}`,
            color: '#FF5733',
            textColor: 'white',
          });

          fecha.setDate(fecha.getDate() + 7);
        }

        return eventos;
      });

      return eventosDelMedico.flat();
    } else {
      console.warn("Datos inválidos para el horario:", horario);
      return null;
    }
  }).flat().filter(event => event !== null);

  calendar.removeAllEvents();
  calendar.addEventSource(eventos);
}

// Función para cargar los turnos disponibles para un día seleccionado
async function cargarTurnos(fechaSeleccionada) {
  const turnosContainer = document.getElementById('turnos-container');
  turnosContainer.innerHTML = '';  // Limpiar los turnos previos

  const especialidadSelect = document.getElementById('especialidad');
  const response = await fetch(`/horarios/obtenerHorarios?id_especialidad=${especialidadSelect.value}`);
  const horarios = await response.json();
  console.log(horarios)

  // Obtener el día de la semana (0 = Domingo, ..., 6 = Sábado)
  const diaSeleccionado = fechaSeleccionada.getDay();

  // Filtrar los horarios que coinciden con el día y rango de fecha
  const turnosDisponibles = horarios.filter(horario => {
    const fechaInicio = new Date(horario.fecha_inicio);
    const fechaFin = new Date(horario.fecha_fin);

    // Verificar si la fecha seleccionada está en el rango y si el médico trabaja ese día
    return fechaSeleccionada >= fechaInicio && fechaSeleccionada <= fechaFin &&
      horario.Dias.some(dia => obtenerNumeroDia(dia.nombre_dia) === diaSeleccionado);
  });

  turnosDisponibles.forEach(horario => {
    const horaInicio = horario.hora_inicio;
    const horaFin = horario.hora_fin;
    const duracion = horario.duracion;
    const nombreMedico = `${horario.Medico.nombre} ${horario.Medico.apellido}`;

    let horaActual = new Date(`${fechaSeleccionada.toISOString().split('T')[0]}T${horaInicio}`);
    let turnos = [];

    while (horaActual < new Date(`${fechaSeleccionada.toISOString().split('T')[0]}T${horaFin}`)) {
      const horaFinTurno = new Date(horaActual.getTime() + duracion * 60000);
      turnos.push({
        inicio: horaActual.toLocaleTimeString(),
        fin: horaFinTurno.toLocaleTimeString(),
        medico: nombreMedico,
      });
      horaActual = horaFinTurno;
    }

    turnos.forEach(turno => {
      const turnoDiv = document.createElement('div');
      turnoDiv.classList.add('turno');
      const fechaFormateada = (fechaSeleccionada.toISOString());
      turnoDiv.innerHTML = `
            <p><strong>Medico:</strong> ${turno.medico}</p>
              <p><strong>Hora:</strong> ${turno.inicio} - ${turno.fin}</p>
              <button class="btn-agendar-turno"
  data-medico="${turno.medico}" 
  data-hora-inicio="${turno.inicio}" 
  data-hora-fin="${turno.fin}" 
  data-fecha="${fechaFormateada}"
  data-id-medico="${horario.id_medico}" 
  data-id-especialidad="${horario.id_especialidad}"
  data-id-clinica="${horario.id_clinica}">Agendar turno</button>
          `;

      turnosContainer.appendChild(turnoDiv);
    });

    document.querySelectorAll('.btn-agendar-turno').forEach(button => {
      button.addEventListener('click', mostrarModal);
    });
  });
}

// Función para obtener día de la semana al cargar turnoss
function obtenerNumeroDia(nombreDia) {
  const diasSemana = {
    "domingo": 0,
    "lunes": 1,
    "martes": 2,
    "miercoles": 3,
    "jueves": 4,
    "viernes": 5,
    "sabado": 6
  };
  return diasSemana[nombreDia.toLowerCase()];
}

/////////////////////////Modal//////////////////////////////

const modal = document.getElementById('modalAgendarTurno');
const cancelarBtn = document.getElementById('cancelarBtn');
const agendarBtn = document.getElementById('agendarBtn');
const dniPacienteInput = document.getElementById('dniPaciente');
let turnoSeleccionado = null;

// Función para mostrar y ocultarel modal

function mostrarModal(event) {
  const turnoButton = event.target;

  // Obtener los datos del turno desde los atributos data-* del botón
  turnoSeleccionado = {
    medico: turnoButton.getAttribute('data-medico'),
    hora_inicio: turnoButton.getAttribute('data-hora-inicio'),
    hora_fin: turnoButton.getAttribute('data-hora-fin'),
    fecha: turnoButton.getAttribute('data-fecha'),
    id_medico: turnoButton.getAttribute('data-id-medico'),
    id_especialidad: turnoButton.getAttribute('data-id-especialidad'),
    id_clinica: turnoButton.getAttribute('data-id-clinica')
  };

  // Mostrar los datos en el modal
  const modal = document.getElementById('modalAgendarTurno');

  if (modal) {
    // Actualizar los elementos dentro del modal con los datos del turno
    const medicoElem = modal.querySelector('#modal-medico');
    const horaElem = modal.querySelector('#modal-hora');
    const fechaElem = modal.querySelector('#modal-fecha');

    if (medicoElem && horaElem && fechaElem) {
      medicoElem.textContent = `Medico: ${turnoSeleccionado.medico}`;
      horaElem.textContent = `Hora: ${turnoSeleccionado.hora_inicio} - ${turnoSeleccionado.hora_fin}`;
      fechaElem.textContent = `Fecha: ${new Date(turnoSeleccionado.fecha).toLocaleDateString()}`;
    } else {
      console.error('Elementos del modal no encontrados');
    }

    // Eliminar la clase 'hidden' para mostrar el modal
    modal.classList.remove('hidden');
    modal.classList.add('visible');
  } else {
    console.error('Modal no encontrado');
  }
}

function ocultarModal() {
  modal.classList.remove('visible');
  dniPacienteInput.value = '';
}

// Eventos de los botones
cancelarBtn.addEventListener('click', function () {
  ocultarModal(); // Oculta el modal
  dniPacienteInput.value = ''; // Limpiar el campo DNI al cerrar el modal

  // Eliminar el mensaje de error si existe
  const mensajeError = dniPacienteInput.nextElementSibling; // Seleccionar el siguiente elemento (mensaje de error)
  if (mensajeError && mensajeError.style.color === 'red') {
    mensajeError.remove(); // Eliminar el mensaje de error
  }
});

agendarBtn.addEventListener('click', async function () {
  const dni = dniPacienteInput.value;

  if (!dni) {
    alert('Por favor, ingrese un DNI');
    return;
  }
  //Eliminar msj de erro
  const mensajeError = dniPacienteInput.nextElementSibling;
  if (mensajeError && mensajeError.style.color === 'red') {
    mensajeError.remove();
  }

  try {
    // Verificar si el paciente existe
    const response = await fetch(`/pacientes/verificar/${dni}`);
    const data = await response.json();
    if (data.existe) {
      // Si el paciente existe, mostrar el mensaje de confirmación
      console.log(data);
      const confirmar = confirm(`Paciente encontrado: ${data.nombre}. ¿Desea agendar el turno?`);
      if (confirmar && turnoSeleccionado) {
        console.log('Datos para agendar el turno:', {
          id_medico: turnoSeleccionado.id_medico,
          id_especialidad: turnoSeleccionado.id_especialidad,
          id_clinica: turnoSeleccionado.id_clinica,
          id_paciente: data.id,
          fecha: formatearFecha(turnoSeleccionado.fecha),
          hora_inicio: turnoSeleccionado.hora_inicio,
          hora_fin: turnoSeleccionado.hora_fin,
        });
        
        const response = await fetch('/agendaTurno/agendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id_medico: turnoSeleccionado.id_medico,
            id_especialidad: turnoSeleccionado.id_especialidad,
            id_clinica: turnoSeleccionado.id_clinica,  
            id_paciente: data.id,                
            fecha: formatearFecha(turnoSeleccionado.fecha),
            hora_inicio: turnoSeleccionado.hora_inicio,
            hora_fin: turnoSeleccionado.hora_fin,
          })
        });

        if (response.ok) {
          alert('Turno agendado con éxito');
          ocultarModal(); // Cerrar el modal
        } else {
          alert('Hubo un error al agendar el turno');
        }
      }
    } else {
      // Si el paciente no existe, mostrar el mensaje de error
      dniPacienteInput.insertAdjacentHTML('afterend', '<p style="color: red;">No existe paciente con ese DNI, contactese con administración.</p>');
    }
  } catch (error) {
    console.error('Error al verificar el paciente:', error);
    alert('Hubo un error al verificar el paciente. Intente de nuevo.');
  }
});

//para mandar a la bd bien
function formatearFecha(fechaISO) {
  const d = new Date(fechaISO);
  const año = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}
