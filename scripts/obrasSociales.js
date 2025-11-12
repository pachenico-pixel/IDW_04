document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("obraSocialForm");
  const nombreInput = document.getElementById("nombreObra");
  const descripcionInput = document.getElementById("descripcionObra");
  const descuentoInput = document.getElementById("descuentoObra");
  const tabla = document.getElementById("listaObrasSociales").querySelector("tbody");

  let editandoId = null;

  // Cargar datos base desde JSON
  const response = await fetch("data/data.json");
  const data = await response.json();
  const obrasBase = data.obrasSociales || [];

  // Cargar localStorage
  let obrasLocal = JSON.parse(localStorage.getItem("obrasSociales")) || [];

  // Combinar ambas fuentes
  let todasLasObras = [...obrasBase, ...obrasLocal];

  mostrarObrasSociales(todasLasObras, tabla);

  // --- Guardar o editar obra social ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    const descuento = parseInt(descuentoInput.value);

    if (nombre === "" || isNaN(descuento)) {
      alert("Por favor complete todos los campos correctamente.");
      return;
    }

    if (editandoId) {
      // Editar obra
      const index = obrasLocal.findIndex(o => o.id === editandoId);
      obrasLocal[index] = { ...obrasLocal[index], nombre, descripcion, descuento };
      alert("✅ Obra Social actualizada correctamente");
      editandoId = null;
      form.querySelector("button[type=submit]").textContent = "Registrar Obra Social";
    } else {
      // Nueva obra
      const nuevaObra = {
        id: Math.floor(Math.random() * 1000) + 1,
        nombre,
        descripcion,
        descuento
      };
      obrasLocal.push(nuevaObra);
      alert("✅ Obra Social registrada correctamente");
    }

    // Guardar en localStorage
    localStorage.setItem("obrasSociales", JSON.stringify(obrasLocal));

    todasLasObras = [...obrasBase, ...obrasLocal];
    mostrarObrasSociales(todasLasObras, tabla);

    form.reset();
  });

  // --- Editar / Eliminar ---
  tabla.addEventListener("click", (e) => {
    const id = parseInt(e.target.dataset.id);

    if (e.target.classList.contains("btn-eliminar")) {
      obrasLocal = obrasLocal.filter(o => o.id !== id);
      localStorage.setItem("obrasSociales", JSON.stringify(obrasLocal));
      todasLasObras = [...obrasBase, ...obrasLocal];
      mostrarObrasSociales(todasLasObras, tabla);
      alert("🗑️ Obra Social eliminada correctamente");
    }

    if (e.target.classList.contains("btn-editar")) {
      const obra = obrasLocal.find(o => o.id === id);
      if (!obra) return;

      nombreInput.value = obra.nombre;
      descripcionInput.value = obra.descripcion;
      descuentoInput.value = obra.descuento;

      editandoId = obra.id;
      form.querySelector("button[type=submit]").textContent = "Guardar Cambios";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
});

// --- Mostrar obras en tabla ---
function mostrarObrasSociales(obras, tabla) {
  tabla.innerHTML = "";

  obras.forEach(obra => {
    const esLocal = typeof obra.id === "number";
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${obra.id}</td>
      <td>${obra.nombre}</td>
      <td>${obra.descripcion || "-"}</td>
      <td>${obra.descuento}%</td>
      <td>
        ${esLocal
          ? `
            <button class="btn btn-warning btn-sm btn-editar" data-id="${obra.id}">Editar</button>
            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${obra.id}">Eliminar</button>
          `
          : `<span class="text-muted">Datos fijos</span>`}
      </td>
    `;
    tabla.appendChild(fila);
  });
}
