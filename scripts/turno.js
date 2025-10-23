const formulario = document.getElementById('turnoForm');
const inputNombre = document.getElementById('nombre');
const inputEspecialidad = document.getElementById('especialidad');
const inputProfesional = document.getElementById('profesional');
const inputDni = document.getElementById('dni');
const inputFecha = document.getElementById('fecha');
const inputHorario = document.getElementById('horario');
const inputObservacion = document.getElementById('observacion');
const inputObraSocial = document.getElementById('obrasSocial');
const inputEmail = document.getElementById('email');
const tablaBody = document.querySelector('#tablaTurnos tbody');

let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
let editIndex = null; // null = alta, numero = editar

mostrarTurnos();

function altaOModificarTurno(event) {
    event.preventDefault();

    const nuevoTurno = {
        nombre: inputNombre.value.trim(),
        especialidad: inputEspecialidad.value.trim(),
        profesional: inputProfesional.value.trim(),
        dni: inputDni.value.trim(),
        fecha: inputFecha.value.trim(),
        horario: inputHorario.value.trim(),
        observacion: inputObservacion.value.trim(),
        obraSocial: inputObraSocial.value.trim(),
        email: inputEmail.value.trim()
    };

    if (editIndex === null) {
        //Alta
        turnos.push(nuevoTurno);
        alert('Turno registrado con éxito');
    } else {
        //Editar
        turnos[editIndex] = nuevoTurno;
        alert('Datos del turno actualizados con éxito');
        editIndex = null;
    }

    guardarEnLocalStorage();
    mostrarTurnos();
    formulario.reset();
}

function mostrarTurnos() {
    tablaBody.innerHTML = '';

    turnos.forEach((turno, index) => {
        const fila = document.createElement('tr');
        fila.classList.add('text-center');

        fila.innerHTML = `
            <td>${turno.nombre}</td>
            <td>${turno.especialidad}</td>
            <td>${turno.profesional}</td>
            <td>${turno.dni}</td>
            <td>${turno.fecha}</td>
            <td>${turno.horario}</td>
            <td>${turno.observacion}</td>
            <td>${turno.obraSocial}</td>
            <td>${turno.email}</td>
            <td>
                <button class="btn btn-warning btn-sm me-2" onclick="editarTurno(${index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarTurno(${index})">Eliminar</button>
            </td>
        `;

        tablaBody.appendChild(fila);
    });
}

function guardarEnLocalStorage() {
    localStorage.setItem('turnos', JSON.stringify(turnos));
}

function eliminarTurno(index) {
    if (confirm('¿Desea eliminar este turno?')) {
        turnos.splice(index, 1);
        guardarEnLocalStorage();
        mostrarTurnos();
    }
}

function editarTurno(index) {
    const turno = turnos[index];
    inputNombre.value = turno.nombre;
    inputEspecialidad.value = turno.especialidad;
    inputProfesional.value = turno.profesional;
    inputDni.value = turno.dni;
    inputFecha.value = turno.fecha;
    inputHorario.value = turno.horario;
    inputObservacion.value = turno.observacion;
    inputObraSocial.value = turno.obraSocial;
    inputEmail.value = turno.email;

    editIndex = index;
    window.scrollTo(0, 0);
}

formulario.addEventListener('submit', altaOModificarTurno);