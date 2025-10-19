const formulario = document.getElementById('abmMedicoForm');
const inputNombreApellido = document.getElementById('nombreApellido');
const inputEspecialidad = document.getElementById('especialidad');
const inputTelefono = document.getElementById('telefono');
const inputEmail = document.getElementById('email');
const inputObraSocial = document.getElementById('obraSocial');
const tablaBody = document.querySelector('#listaMedicos tbody');

let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
let editIndex = null; // null = alta, numero = editar

mostrarMedicos();


function altaOModificarMedico(event) {
    event.preventDefault();

    const nuevoMedico = {
        nombre: inputNombreApellido.value.trim(),
        especialidad: inputEspecialidad.value.trim(),
        telefono: inputTelefono.value.trim(),
        email: inputEmail.value.trim(),
        obraSocial: inputObraSocial.value.trim()
    };

    if (editIndex === null) {
        //Alta
        medicos.push(nuevoMedico);
        alert('Médico registrado con exito');
    } else {
        //Editar
        medicos[editIndex] = nuevoMedico;
        alert('Datos del médico actualizados con exito');
        editIndex = null;
    }

    guardarEnLocalStorage();
    mostrarMedicos();
    formulario.reset();
}

function mostrarMedicos() {
    tablaBody.innerHTML = '';

    medicos.forEach((medico, index) => {
        const fila = document.createElement('tr');
        fila.classList.add('text-center');

        fila.innerHTML = `
            <td>${medico.nombre}</td>
            <td>${medico.especialidad}</td>
            <td>${medico.telefono}</td>
            <td>${medico.obraSocial}</td>
            <td>${medico.email}</td>
            <td>
                <button class="btn btn-warning btn-sm me-2" onclick="editarMedico(${index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${index})">Eliminar</button>
            </td>
        `;

        tablaBody.appendChild(fila);
    });
}

function guardarEnLocalStorage() {
    localStorage.setItem('medicos', JSON.stringify(medicos));
}

function eliminarMedico(index) {
    if (confirm('¿Desea eliminar este médico?')) {
        medicos.splice(index, 1);
        guardarEnLocalStorage();
        mostrarMedicos();
    }
}

function editarMedico(index) {
    const medico = medicos[index];
    inputNombreApellido.value = medico.nombre;
    inputEspecialidad.value = medico.especialidad;
    inputTelefono.value = medico.telefono;
    inputEmail.value = medico.email;
    inputObraSocial.value = medico.obraSocial;

    editIndex = index;
}

formulario.addEventListener('submit', altaOModificarMedico);
