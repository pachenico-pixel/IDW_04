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
        especialidad: inputEspecialidad.value.trim(),
        descripcion: inputDescripcion.value.trim(),
        duracion: inputDuracion.value.trim(),
        costoConsulta: inputCostoConsulta.value.trim()
    };

    if (editIndex === null) {
        //Alta
        especialidades.push(nuevaEspecialidad);
        alert('Especialidad registrada con éxito');
    } else {
        //Editar
        especialidades[editIndex] = nuevaEspecialidad;
        alert('Datos de la especialidad actualizados con éxito');
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
            <td>${especialidad.especialidad}</td>
            <td>${especialidad.descripcion}</td>
            <td>${especialidad.duracion}</td>
            <td>${especialidad.costoConsulta}</td>
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
    inputEspecialidad.value = especialidad.especialidad;
    inputDescripcion.value = especialidad.descripcion;
    inputDuracion.value = especialidad.duracion;
    inputCostoConsulta.value = especialidad.costoConsulta;

    editIndex = index;
    window.scrollTo(0, 0);
}

formulario.addEventListener('submit', altaOModificarEspecialidad);