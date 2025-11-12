document.addEventListener("DOMContentLoaded", async () => {
  const selectEspecialidad = document.getElementById("especialidad");
  const contenedorObrasSociales = document.getElementById("checkboxObrasSociales");
  const listaMedicos = document.getElementById("listaMedicos").querySelector("tbody");
  const form = document.getElementById("abmMedicoForm");
  const inputFoto = document.getElementById("fotografia");
  const preview = document.getElementById("previewFoto");

  let editandoId = null;
  let fotoBase64 = "";

  // 📁 Cargar datos base desde JSON
  const response = await fetch("data/data.json");
  const data = await response.json();

  const especialidadesBase = data.especialidades || [];
  const obrasSocialesBase = data.obrasSociales || [];
  const medicosBase = data.medicos || [];

  // 📦 Cargar datos de LocalStorage
  let especialidadesLocal = JSON.parse(localStorage.getItem("especialidades")) || [];
  let obrasSocialesLocal = JSON.parse(localStorage.getItem("obrasSociales")) || [];
  let medicosLocal = JSON.parse(localStorage.getItem("medicos")) || [];

  // 🔹 Combinar datos JSON + LocalStorage
  const especialidades = [...especialidadesBase, ...especialidadesLocal];
  const obrasSociales = [...obrasSocialesBase, ...obrasSocialesLocal];
  let todosLosMedicos = [...medicosBase, ...medicosLocal];

  // --- Cargar especialidades en el select ---
  selectEspecialidad.innerHTML = '<option value="">Seleccione una especialidad</option>';
  especialidades.forEach(esp => {
    const option = document.createElement("option");
    option.value = esp.id;
    option.textContent = esp.nombre;
    selectEspecialidad.appendChild(option);
  });

  // --- Cargar obras sociales como checkboxes ---
  function cargarObrasSociales() {
    contenedorObrasSociales.innerHTML = "";
    obrasSociales.forEach(os => {
      const div = document.createElement("div");
      div.classList.add("form-check");
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${os.id}" id="obra-${os.id}">
        <label class="form-check-label" for="obra-${os.id}">${os.nombre}</label>
      `;
      contenedorObrasSociales.appendChild(div);
    });
  }

  cargarObrasSociales();

  // --- Mostrar médicos ---
  mostrarMedicos(todosLosMedicos, especialidades, obrasSociales, listaMedicos);

  // --- Vista previa de la foto ---
  inputFoto.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      fotoBase64 = reader.result;
      preview.src = fotoBase64;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  // --- Guardar o editar médico ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const especialidad = parseInt(selectEspecialidad.value);
    const valorConsulta = parseInt(document.getElementById("valorConsulta").value);
    const descripcion = document.getElementById("descripcion").value.trim();
    const obrasSeleccionadas = Array.from(
      document.querySelectorAll("#checkboxObrasSociales input:checked")
    ).map(input => parseInt(input.value));

    if (!fotoBase64) {
      alert("Por favor, suba una foto del médico.");
      return;
    }

    if (editandoId) {
      // Editar médico existente
      const index = medicosLocal.findIndex(m => m.id === editandoId);
      medicosLocal[index] = {
        ...medicosLocal[index],
        nombre,
        apellido,
        especialidad,
        valorConsulta,
        descripcion,
        obrasSociales: obrasSeleccionadas,
        fotografia: fotoBase64
      };
      alert("✅ Médico actualizado correctamente");
      editandoId = null;
      form.querySelector("button[type=submit]").textContent = "Registrar Médico";
    } else {
      // Registrar nuevo médico
      const nuevoMedico = {
        id: Math.floor(Math.random() * 1000) + 1,
        nombre,
        apellido,
        especialidad,
        obrasSociales: obrasSeleccionadas,
        valorConsulta,
        descripcion,
        fotografia: fotoBase64
      };
      medicosLocal.push(nuevoMedico);
      alert("✅ Médico registrado correctamente.");
    }

    localStorage.setItem("medicos", JSON.stringify(medicosLocal));
    todosLosMedicos = [...medicosBase, ...medicosLocal];
    mostrarMedicos(todosLosMedicos, especialidades, obrasSociales, listaMedicos);
    form.reset();
    preview.style.display = "none";
    fotoBase64 = "";
  });

  // --- Botones de eliminar y editar ---
  listaMedicos.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
      const id = parseInt(e.target.dataset.id);
      medicosLocal = medicosLocal.filter(m => m.id !== id);
      localStorage.setItem("medicos", JSON.stringify(medicosLocal));
      todosLosMedicos = [...medicosBase, ...medicosLocal];
      mostrarMedicos(todosLosMedicos, especialidades, obrasSociales, listaMedicos);
      alert("🗑️ Médico eliminado.");
    }

    if (e.target.classList.contains("btn-editar")) {
      const id = parseInt(e.target.dataset.id);
      const medico = medicosLocal.find(m => m.id === id);
      if (!medico) return;

      document.getElementById("nombre").value = medico.nombre;
      document.getElementById("apellido").value = medico.apellido;
      document.getElementById("especialidad").value = medico.especialidad;
      document.getElementById("valorConsulta").value = medico.valorConsulta;
      document.getElementById("descripcion").value = medico.descripcion;
      document.querySelectorAll("#checkboxObrasSociales input").forEach(chk => {
        chk.checked = medico.obrasSociales.includes(parseInt(chk.value));
      });

      if (medico.fotografia) {
        preview.src = medico.fotografia;
        preview.style.display = "block";
        fotoBase64 = medico.fotografia;
      } else {
        preview.style.display = "none";
      }

      editandoId = medico.id;
      form.querySelector("button[type=submit]").textContent = "Guardar Cambios";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
});

// --- Función para mostrar médicos ---
function mostrarMedicos(medicos, especialidades, obrasSociales, tabla) {
  tabla.innerHTML = "";

  medicos.forEach(medico => {
    const especialidadNombre =
      especialidades.find(esp => esp.id === medico.especialidad)?.nombre || "Sin asignar";

    const obras =
      Array.isArray(medico.obrasSociales) && medico.obrasSociales.length > 0
        ? medico.obrasSociales
            .map(id => obrasSociales.find(os => os.id === id)?.nombre)
            .filter(Boolean)
            .join(", ")
        : "-";

    const valorConsulta = medico.valorConsulta
      ? medico.valorConsulta.toLocaleString("es-AR", { style: "currency", currency: "ARS" })
      : "-";

    const esLocal = typeof medico.id === "number";

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td class="text-center">
        ${medico.fotografia ? `<img src="${medico.fotografia}" alt="Foto" class="rounded" style="width:50px; height:50px; object-fit:cover;">` : ""}
      </td>
      <td class="text-center">${medico.nombre} ${medico.apellido}</td>
      <td class="text-center">${especialidadNombre}</td>
      <td class="text-center">${valorConsulta}</td>
      <td class="text-center">${obras}</td>
      <td class="text-center">${medico.descripcion}</td>
      <td class="text-center">
        ${esLocal
          ? `
            <button class="btn btn-warning btn-sm btn-editar" data-id="${medico.id}">Editar</button>
            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${medico.id}">Eliminar</button>
          `
          : `<span class="text-muted">Datos fijos</span>`}
      </td>
    `;
    tabla.appendChild(fila);
  });
}
