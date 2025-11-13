document.addEventListener("DOMContentLoaded", async () => {
  const selectEspecialidad = document.getElementById("especialidad");
  const selectMedico = document.getElementById("medico");
  const selectTurno = document.getElementById("fechaHora");
  const obrasSocialesContainer = document.getElementById("obrasSociales");
  const valorConsultaSpan = document.getElementById("valorConsulta");
  const infoMedico = document.getElementById("infoMedico");
  const btnSubmit = document.querySelector("button[type='submit']");
  const form = document.getElementById("reservaForm");

  const response = await fetch("data/data.json");
  const data = await response.json();

  const especialidadesBase = data.especialidades;
  const especialidadesLocal = JSON.parse(localStorage.getItem("especialidades")) || [];
  const especialidades = [...especialidadesBase, ...especialidadesLocal];

  const obrasSocialesBase = data.obrasSociales;
  const obrasSocialesLocal = JSON.parse(localStorage.getItem("obrasSociales")) || [];
  const obrasSociales = [...obrasSocialesBase, ...obrasSocialesLocal];
  const medicosBase = data.medicos;

  const medicosLocal = JSON.parse(localStorage.getItem("medicos")) || [];
  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  const medicos = [...medicosBase, ...medicosLocal];

  // 🩺 Cargar especialidades
  especialidades.forEach((esp) => {
    const option = document.createElement("option");
    option.value = esp.id;
    option.textContent = esp.nombre;
    selectEspecialidad.appendChild(option);
  });

  // Cambia especialidad
  selectEspecialidad.addEventListener("change", () => {
    const idEsp = parseInt(selectEspecialidad.value);
    selectMedico.innerHTML = '<option value="">Seleccione un médico</option>';
    selectTurno.innerHTML = '<option value="">Seleccione una fecha y hora</option>';
    obrasSocialesContainer.innerHTML = "";
    valorConsultaSpan.textContent = "";
    infoMedico.classList.add("d-none");

    if (!idEsp) return;

    const medicosFiltrados = medicos.filter((m) => m.especialidad === idEsp);
    medicosFiltrados.forEach((m) => {
      const option = document.createElement("option");
      option.value = m.id;
      option.textContent = `${m.nombre} ${m.apellido}`;
      selectMedico.appendChild(option);
    });

    selectMedico.disabled = medicosFiltrados.length === 0;
    selectTurno.disabled = true;
  });

  // Cambia médico
  selectMedico.addEventListener("change", () => {
    const medicoId = parseInt(selectMedico.value);
    const medico = medicos.find((m) => m.id === medicoId);
    selectTurno.innerHTML = '<option value="">Seleccione una fecha y hora</option>';
    obrasSocialesContainer.innerHTML = "";
    valorConsultaSpan.innerHTML = "";

    if (!medico) return;

    infoMedico.classList.remove("d-none");

    // Mostrar obras sociales como checkboxes
    medico.obrasSociales.forEach((id) => {
      const obra = obrasSociales.find((o) => o.id === id);
      if (!obra) return;

      const div = document.createElement("div");
      div.classList.add("form-check");

      div.innerHTML = `
        <input class="form-check-input obra-checkbox" type="checkbox" name="obraSocial" id="obra${obra.id}" value="${obra.id}">
        <label class="form-check-label" for="obra${obra.id}">
          ${obra.nombre} (Descuento ${obra.descuento}%)
        </label>
      `;

      obrasSocialesContainer.appendChild(div);
    });

    // Mostrar precio original
    valorConsultaSpan.innerHTML = `
      <strong>Precio original:</strong> ${medico.valorConsulta.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      })}<br>
      <strong>Precio con descuento:</strong> —
    `;

    // Solo una checkbox activa a la vez
    const checkboxes = obrasSocialesContainer.querySelectorAll(".obra-checkbox");
    checkboxes.forEach((chk) => {
      chk.addEventListener("change", (e) => {
        if (e.target.checked) {
          checkboxes.forEach((c) => {
            if (c !== e.target) c.checked = false;
          });

          const obra = obrasSociales.find((o) => o.id === parseInt(e.target.value));
          const descuento = obra ? obra.descuento : 0;
          const valorConDescuento = medico.valorConsulta * (1 - descuento / 100);

          valorConsultaSpan.innerHTML = `
            <strong>Precio original:</strong> ${medico.valorConsulta.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}<br>
             <strong>Precio con descuento (${obra.nombre} -${obra.descuento}%):</strong> 
            ${valorConDescuento.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          `;
        } else {
          valorConsultaSpan.innerHTML = `
            <strong>Precio original:</strong> ${medico.valorConsulta.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}<br>
            <strong>Precio con descuento:</strong> —
          `;
        }
      });
    });

    // Mostrar turnos disponibles
    const turnosDisponibles = turnos.filter(
      (t) => t.medicoId === medicoId && t.disponible === true
    );

    turnosDisponibles.forEach((t) => {
      const option = document.createElement("option");
      option.value = t.id;
      option.textContent = `${t.fecha} ${t.hora}`;
      selectTurno.appendChild(option);
    });

    selectTurno.disabled = turnosDisponibles.length === 0;
  });

  // Habilitar submit solo si hay turno y obra social seleccionada
  selectTurno.addEventListener("change", () => {
    const obraSeleccionada = document.querySelector(".obra-checkbox:checked");
    btnSubmit.disabled = !(selectTurno.value && obraSeleccionada);
  });

  obrasSocialesContainer.addEventListener("change", () => {
    btnSubmit.disabled = !(selectTurno.value && document.querySelector(".obra-checkbox:checked"));
  });

  // Guardar reserva
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const obraSeleccionada = document.querySelector(".obra-checkbox:checked");
    if (!obraSeleccionada) {
      alert("Por favor seleccione una obra social.");
      return;
    }

    const obra = obrasSociales.find((o) => o.id === parseInt(obraSeleccionada.value));
    const medico = medicos.find((m) => m.id === parseInt(selectMedico.value));

    const valorConDescuento = medico.valorConsulta * (1 - obra.descuento / 100);

    const reserva = {
      id: Math.floor(Math.random() * 10000) + 1,
      documento: document.getElementById("documento").value,
      nombre: document.getElementById("nombre").value,
      turnoId: parseInt(selectTurno.value),
      medicoId: parseInt(selectMedico.value),
      especialidadId: parseInt(selectEspecialidad.value),
      obraSocialId: parseInt(obraSeleccionada.value),
      valorTotal: valorConDescuento,
    };

    reservas.push(reserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    // Cambiar turno a no disponible
    const index = turnos.findIndex((t) => t.id === reserva.turnoId);
    if (index !== -1) {
      turnos[index].disponible = false;
      localStorage.setItem("turnos", JSON.stringify(turnos));
    }

    alert(`Reserva registrada con éxito.
Valor total: ${valorConDescuento.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    })}`);

    form.reset();
    selectMedico.disabled = true;
    selectTurno.disabled = true;
    btnSubmit.disabled = true;
    infoMedico.classList.add("d-none");
    obrasSocialesContainer.innerHTML = "";
    valorConsultaSpan.textContent = "";
  });

  // 🔎 --- BUSCADOR POR DNI ---
  const inputBuscar = document.getElementById("buscarDni");
  const btnBuscar = document.getElementById("btnBuscar");
  const resultadosDiv = document.getElementById("resultadosBusqueda");

  btnBuscar.addEventListener("click", () => {
    const dni = inputBuscar.value.trim();
    resultadosDiv.innerHTML = "";

    if (dni === "") {
      resultadosDiv.innerHTML = `<p class="text-danger">Ingrese un DNI válido para buscar.</p>`;
      return;
    }

    const reservasGuardadas = JSON.parse(localStorage.getItem("reservas")) || [];
    const resultados = reservasGuardadas.filter((r) =>
      r.documento.toLowerCase().includes(dni.toLowerCase())
    );

    if (resultados.length === 0) {
      resultadosDiv.innerHTML = `<p class="text-muted">No se encontraron reservas para el DNI ingresado.</p>`;
      return;
    }

    resultados.forEach((res) => {
      const medico = medicos.find((m) => m.id === res.medicoId);
      const especialidad = especialidades.find((e) => e.id === res.especialidadId);
      const obra = obrasSociales.find((o) => o.id === res.obraSocialId);
      const turno = turnos.find((t) => t.id === res.turnoId);

      const card = document.createElement("div");
      card.classList.add("card", "mb-3", "shadow-sm");
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${res.nombre}</h5>
          <p class="card-text mb-1"><strong>DNI:</strong> ${res.documento}</p>
          <p class="card-text mb-1"><strong>Médico:</strong> ${medico ? medico.nombre + " " + medico.apellido : "Desconocido"}</p>
          <p class="card-text mb-1"><strong>Especialidad:</strong> ${especialidad ? especialidad.nombre : "—"}</p>
          <p class="card-text mb-1"><strong>Obra Social:</strong> ${obra ? obra.nombre : "—"}</p>
          <p class="card-text mb-1"><strong>Fecha:</strong> ${turno ? turno.fecha : "—"} - ${turno ? turno.hora : ""}</p>
          <p class="card-text"><strong>Valor Total:</strong> ${res.valorTotal.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}</p>
        </div>
      `;
      resultadosDiv.appendChild(card);
    });
  });
});
