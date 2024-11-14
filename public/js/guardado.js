document.addEventListener('DOMContentLoaded', async function() {
    const calendarEl = document.getElementById('calendar');
    const especialidadSelect = document.getElementById('especialidad');
  
    // Iniciar el calendario
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: [],  // Inicialmente vacío
      eventClick: function(info) {
        alert('Has hecho clic en un evento');
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
  
    // Función para calcular la fecha correspondiente según el día de la semana
    function calcularFechaConBase(fechaBase, diaSemana) {
      const diasSemana = {
        "lunes": 1,
        "martes": 2,
        "miercoles": 3,
        "jueves": 4,
        "viernes": 5,
        "sabado": 6,
        "domingo": 0
      };
      
      const dia = fechaBase.getDay();  // Obtiene el día de la semana (0 - Domingo, 1 - Lunes, ...)
      const diaObjetivo = diasSemana[diaSemana];  // El día que queremos encontrar (lunes, martes, etc.)
      const diferencia = (diaObjetivo - dia + 7) % 7;  // Diferencia para ajustar la fecha
      const fecha = new Date(fechaBase);
      fecha.setDate(fechaBase.getDate() + diferencia);  // Ajustamos la fecha
      return fecha;
    }
  
    // Cargar eventos según especialidad
    async function cargarEventos(especialidadId) {
      const response = await fetch(`/horarios/obtenerHorarios?id_especialidad=${especialidadId}`);
      const horarios = await response.json();
  
      // Mapear los horarios a eventos de FullCalendar
      const eventos = horarios.map(horario => {
        // Validar que el objeto "Especialidad" y sus propiedades existan
        const especialidad = (horario.Especialidad && horario.Especialidad.especialidad) ? horario.Especialidad.especialidad : 'Especialidad desconocida';
        const nombreMedico = (horario.Medico && horario.Medico.nombre) ? horario.Medico.nombre : 'Medico desconocido';
        const horaInicio = horario.hora_inicio || '';
        const horaFin = horario.hora_fin || '';
        const fechaInicio = new Date(horario.fecha_inicio);  // Convertir fecha_inicio a objeto Date
        const fechaFin = new Date(horario.fecha_fin);        // Convertir fecha_fin a objeto Date
        const diasSemana = (horario.Dias && Array.isArray(horario.Dias)) ? horario.Dias.map(dia => dia.nombre_dia) : [];

        // Verificar si los datos necesarios están presentes
        if (horaInicio && horaFin && fechaInicio && fechaFin && diasSemana.length > 0) {
          const eventosDelMedico = diasSemana.map(dia => {
            let fecha = calcularFechaConBase(fechaInicio, dia);

            // Crear eventos solo si están dentro del rango de fecha
            const eventos = [];
            while (fecha <= fechaFin) {
              // Componer la fecha completa en formato ISO 8601
              const start = `${fecha.toISOString().split('T')[0]}T${horaInicio}`;
              const end = `${fecha.toISOString().split('T')[0]}T${horaFin}`;
  
              eventos.push({
                title: `${nombreMedico} - ${especialidad}`,
                start: start,  // Formato ISO 8601
                end: end,      // Formato ISO 8601
                description: `Especialidad: ${especialidad}`,
                color: '#FF5733',  // Color del evento
                textColor: 'white', // Color del texto
              });
  
              // Sumar 7 días para la siguiente ocurrencia
              fecha.setDate(fecha.getDate() + 7);
            }
  
            return eventos;
          });
  
          // Devolver todos los eventos mapeados
          return eventosDelMedico.flat(); // Aplana el array de eventos
        } else {
          console.warn("Datos inválidos para el horario:", horario);
          return null;  // Devuelve null si los datos no son válidos
        }
      }).flat().filter(event => event !== null);  // Aplana el array de eventos y elimina los nulos
  
      // Remover eventos existentes y cargar los nuevos en FullCalendar
      calendar.removeAllEvents();
      calendar.addEventSource(eventos);
    }
  
    // Escuchar cambios en el selector de especialidad
    especialidadSelect.addEventListener('change', function() {
      const especialidadId = especialidadSelect.value;
      if (especialidadId) {
        cargarEventos(especialidadId);
      } else {
        calendar.removeAllEvents(); // Limpiar el calendario si no hay especialidad seleccionada
      }
    });
  
    // Renderizar el calendario
    calendar.render();
});
