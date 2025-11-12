document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("turnoForm");
  const selectMedico = document.getElementById("medico");
  const inputFecha = document.getElementById("fecha");
  const inputHora = document.getElementById("hora");
  const selectDisponible = document.getElementById("disponible");
  const tablaBody = document.querySelector("#tablaTurnos tbody");

  let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  let medicos = [];
  let editIndex = null;

  // 🔹 Flatpickr solo para fecha
  flatpickr(inputFecha, {
    minDate: "today",
    dateFormat: "Y-m-d",
    locale: "es",
  });

  // 🔹 Flatpickr solo para hora
  flatpickr(inputHora, {
    enableTime: true,
    noCalendar: true,
    time_24hr: true,
    dateFormat: "H:i",
    locale: "es",
  });

  // 🔹 Cargar médicos desde JSON + LocalStorage
  async function cargarMedicos() {
    const response = await fetch("data/data.json");
    const data = await response.json();
    const medicosJSON = data.medicos || [];
    const medicosLocal = JSON.parse(localStorage.getItem("medicos")) || [];
    medicos = [...medicosJSON, ...medicosLocal];

    selectMedico.innerHTML = '<option value="">Seleccione un médico</option>';
    medicos.forEach((m) => {
      const option = document.createElement("option");
      option.value = m.id;
      option.textContent = `${m.nombre} ${m.apellido}`;
      selectMedico.appendChild(option);
    });
  }

  // 🔹 Mostrar turnos en tabla
  function mostrarTurnos() {
    tablaBody.innerHTML = "";
    turnos.forEach((turno, index) => {
      const medico = medicos.find((m) => m.id === turno.medicoId);
      const fila = document.createElement("tr");
      fila.classList.add("text-center");

      fila.innerHTML = `
        <td>${turno.id}</td>
        <td>${medico ? medico.nombre + " " + medico.apellido : "Desconocido"}</td>
        <td>${turno.fecha}</td>
        <td>${turno.hora}</td>
        <td>${turno.disponible ? "Sí" : "No"}</td>
        <td>
          <button class="btn btn-warning btn-sm me-2" onclick="editarTurno(${index})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarTurno(${index})">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
  }

  // 🔹 Guardar en LocalStorage
  function guardarEnLocalStorage() {
    localStorage.setItem("turnos", JSON.stringify(turnos));
  }

  // 🔹 Eliminar turno
  window.eliminarTurno = function (index) {
    turnos.splice(index, 1);
    guardarEnLocalStorage();
    mostrarTurnos();
  };

  // 🔹 Editar turno
  window.editarTurno = function (index) {
    const turno = turnos[index];
    selectMedico.value = turno.medicoId;
    inputFecha.value = turno.fecha;
    inputHora.value = turno.hora;
    selectDisponible.value = turno.disponible.toString();
    editIndex = index;
    window.scrollTo(0, 0);
  };

  // 🔹 Validaciones y envío del formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const medicoId = parseInt(selectMedico.value);
    const fecha = inputFecha.value;
    const hora = inputHora.value;
    const disponible = selectDisponible.value === "true";

    if (!medicoId) return alert("Debe seleccionar un médico.");
    if (!fecha || !hora) return alert("Debe seleccionar fecha y hora.");

    if (editIndex === null) {
      const nuevoTurno = {
        id: Math.floor(Math.random() * 1000) + 1,
        medicoId,
        fecha,
        hora,
        disponible,
      };
      turnos.push(nuevoTurno);
    } else {
      const turnoExistente = turnos[editIndex];
      turnos[editIndex] = {
        id: turnoExistente.id,
        medicoId,
        fecha,
        hora,
        disponible,
      };
      editIndex = null;
    }

    guardarEnLocalStorage();
    mostrarTurnos();
    form.reset();
  });

  // 🔹 Inicialización
  await cargarMedicos();
  mostrarTurnos();
});
