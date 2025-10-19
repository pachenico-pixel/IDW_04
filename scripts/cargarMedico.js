const cardContainer = document.querySelector('#cardContainer .row');

const medicos = JSON.parse(localStorage.getItem('medicos')) || [];

medicos.forEach((medico) => {
  const col = document.createElement('div');
  col.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');

  col.innerHTML = `
      <div class="tdoc h-100 d-flex flex-column m-3 p-4">
        <img src="img/default-img.png" alt=${medico.nombre}>
        <div class="tdoc-info d-flex flex-column">
          <h3 class="mt-auto text-center">${medico.nombre}</h3>
          <p class="text-center mt-auto">Especialidad: ${medico.especialidad}</p>
        </div>
      </div>`;

  cardContainer.appendChild(col);
});


