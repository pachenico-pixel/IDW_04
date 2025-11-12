document.addEventListener("DOMContentLoaded", async () => {
  const cardContainer = document.querySelector("#cardContainer .row");

  // Cargar datos desde JSON
  const response = await fetch("data/data.json");
  const data = await response.json();

  const especialidadesJSON = data.especialidades;
  const medicosJSON = data.medicos;

  // Cargar datos desde localStorage
  const especialidadesLocal = JSON.parse(localStorage.getItem("especialidades")) || [];
  const medicosLocal = JSON.parse(localStorage.getItem("medicos")) || [];

  // Combinar ambos
  const todasLasEspecialidades = [...especialidadesJSON, ...especialidadesLocal];
  const todosLosMedicos = [...medicosJSON, ...medicosLocal];

  // Mostrar cards
  mostrarMedicos(todosLosMedicos, todasLasEspecialidades, cardContainer);

  // Crear modal si no existe
  if (!document.getElementById("medicoModal")) {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="modal fade" id="medicoModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-center w-100" id="modalMedicoNombre"></h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body text-center">
              <img id="modalMedicoFoto" class="img-fluid rounded mb-3" style="max-height: 250px; object-fit: cover;">
              <p><strong>Especialidad:</strong> <span id="modalMedicoEspecialidad"></span></p>
              <p id="modalMedicoDescripcion" class="text-muted"></p>
            </div>
          </div>
        </div>
      </div>
      `
    );
  }
});

function mostrarMedicos(medicos, especialidades, container) {
  container.innerHTML = "";

  medicos.forEach(medico => {
    const nombreCompleto = medico.nombreApellido || `${medico.nombre} ${medico.apellido}`;
    const especialidadObj = especialidades.find(esp => esp.id === medico.especialidad);
    const especialidadNombre = especialidadObj.nombre;
    const fotoSrc = medico.fotografia 

    // Card principal con los mismos estilos originales
    const card = document.createElement("div");
    card.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3");

    card.innerHTML = `
      <div class="tdoc h-100 d-flex flex-column m-3 p-4 text-center" 
           role="button" data-bs-toggle="modal" data-bs-target="#medicoModal" 
           style="transition: transform 0.2s; background-color: #fff;">
        <img src="${fotoSrc}" alt="${nombreCompleto}" 
             class="rounded mb-3" style="height: 200px; object-fit: cover;">
        <div class="tdoc-info d-flex flex-column">
          <h3 class="mt-auto">${nombreCompleto}</h3>
          <p class="text-center mt-auto">Especialidad: ${especialidadNombre}</p>
        </div>
      </div>
    `;
    const innerCard = card.querySelector(".tdoc");
    innerCard.addEventListener("mouseover", () => (innerCard.style.transform = "scale(1.03)"));
    innerCard.addEventListener("mouseout", () => (innerCard.style.transform = "scale(1)"));

    //Abrir modal
    innerCard.addEventListener("click", () => {
      document.getElementById("modalMedicoNombre").textContent = nombreCompleto;
      document.getElementById("modalMedicoEspecialidad").textContent = especialidadNombre;
      document.getElementById("modalMedicoDescripcion").textContent = medico.descripcion;
      document.getElementById("modalMedicoFoto").src = fotoSrc;
    });

    container.appendChild(card);
  });
}
