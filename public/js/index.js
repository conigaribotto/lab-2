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
  especialidadSelect.addEventListener('change', function() {
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


// Función para calcular la fecha correspondiente según el día de la semana
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
          turnoDiv.innerHTML = `
              <p><strong>Medico:</strong> ${turno.medico}</p>
              <p><strong>Hora:</strong> ${turno.inicio} - ${turno.fin}</p>
              <button class="btn-agendar-turno">Agendar turno</button>
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

// Función para mostrar y ocultarel modal
function mostrarModal() {
  const modal = document.getElementById('modalAgendarTurno');
  modal.classList.add('visible');
}
function ocultarModal() {
  modal.classList.remove('visible');
  dniPacienteInput.value = ''; // Limpiar el campo DNI al cerrar
}

// Eventos de los botones
cancelarBtn.addEventListener('click', function() {
  ocultarModal(); // Oculta el modal
  dniPacienteInput.value = ''; // Limpiar el campo DNI al cerrar el modal

  // Eliminar el mensaje de error si existe
  const mensajeError = dniPacienteInput.nextElementSibling; // Seleccionar el siguiente elemento (mensaje de error)
  if (mensajeError && mensajeError.style.color === 'red') {
    mensajeError.remove(); // Eliminar el mensaje de error
  }
});

// Función para manejar el clic en el botón "Agendar turno"
agendarBtn.addEventListener('click', async function () {
  const dni = dniPacienteInput.value; // Obtener el DNI ingresado en el input

  if (!dni) {
    alert('Por favor, ingrese un DNI');
    return;
  }
    //Eliminar msj de erro
  const mensajeError = dniPacienteInput.nextElementSibling; // Seleccionar el siguiente elemento (mensaje de error)
  if (mensajeError && mensajeError.style.color === 'red') {
    mensajeError.remove(); // Eliminar el mensaje de error
  }

  try {
    // Realizar la solicitud a la ruta de verificación de paciente
    const response = await fetch(`/pacientes/verificar/${dni}`);
    const data = await response.json();

    // Verificar si el paciente existe
    if (data.existe) {
      // Si el paciente existe, mostrar el mensaje de confirmación
      const confirmar = confirm(`Paciente encontrado: ${data.nombre}. ¿Desea agendar el turno?`);
      
      if (confirmar) {
        // Aquí se puede proceder con la lógica para agendar el turno
        // Puedes agregar el código necesario para agendar el turno, o cerrar el modal
        alert('Turno agendado con éxito.');
        ocultarModal();
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

