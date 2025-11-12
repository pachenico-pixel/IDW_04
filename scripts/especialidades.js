const formulario = document.getElementById('especialidadMedicaForm');
const inputEspecialidad = document.getElementById('especialidad');
const inputDescripcion = document.getElementById('descripcion');
const inputDuracion = document.getElementById('duracion');
const inputCostoConsulta = document.getElementById('costoConsulta');
const tablaBody = document.querySelector('#listaEspecialidades tbody');

let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
let editIndex = null; // null = alta, numero = editar

mostrarEspecialidades();

function altaOModificarEspecialidad(event) {
    event.preventDefault();

    const nuevaEspecialidad = {
        id: Math.floor(Math.random() * 1000) + 1,
        nombre: inputEspecialidad.value.trim(),
    };

    if (editIndex === null) {
        //Alta
        especialidades.push(nuevaEspecialidad);
        alert('Especialidad registrada con exito');
    } else {
        //Editar
        especialidades[editIndex] = nuevaEspecialidad;
        alert('Datos de la especialidad actualizados con exito');
        editIndex = null;
    }

    guardarEnLocalStorage();
    mostrarEspecialidades();
    formulario.reset();
}

function mostrarEspecialidades() {
    tablaBody.innerHTML = '';

    especialidades.forEach((especialidad, index) => {
        const fila = document.createElement('tr');
        fila.classList.add('text-center');

        fila.innerHTML = `
            <td>${especialidad.id}</td>
            <td>${especialidad.nombre}</td>
            <td>
                <button class="btn btn-warning btn-sm me-2" onclick="editarEspecialidad(${index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarEspecialidad(${index})">Eliminar</button>
            </td>
        `;

        tablaBody.appendChild(fila);
    });
}

function guardarEnLocalStorage() {
    localStorage.setItem('especialidades', JSON.stringify(especialidades));
}

function eliminarEspecialidad(index) {
    if (confirm('¿Desea eliminar esta especialidad?')) {
        especialidades.splice(index, 1);
        guardarEnLocalStorage();
        mostrarEspecialidades();
    }
}

function editarEspecialidad(index) {
    const especialidad = especialidades[index];
    inputEspecialidad.value = especialidad.nombre;

    editIndex = index;
    window.scrollTo(0, 0);
}

formulario.addEventListener('submit', altaOModificarEspecialidad);