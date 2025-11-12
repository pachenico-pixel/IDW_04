import { login } from './auth.js';

const formLoginMed = document.getElementById('formLoginMed');
const usuario = document.getElementById('usuario');
const clave = document.getElementById('clave');

function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `alert alert-${tipo}`;
    mensajeDiv.textContent = texto;
    
    const container = document.querySelector('.card');
    container.insertBefore(mensajeDiv, formLoginMed);
}

formLoginMed.addEventListener('submit', async function (event) {
    event.preventDefault();
    
    let usuarioInput = usuario.value.trim();
    let claveInput = clave.value.trim();

    if (!usuarioInput || !claveInput) {
        mostrarMensaje('Completa usuario y contraseña', 'warning');
        return;
    }


    let medicos = JSON.parse(sessionStorage.getItem('medicos')) || [];
    let medicoLocal = medicos.find(m => m.usuario === usuarioInput && m.clave === claveInput);
    
    if (medicoLocal) {
        sessionStorage.setItem('usuarioLogueado', medicoLocal.usuario);
        sessionStorage.setItem('token', 'local-token-' + Date.now());
        if (medicoLocal.role) sessionStorage.setItem('role', medicoLocal.role);
        window.location.href = 'pacientes.html';
        return;
    }
    I
    const isUsuario = await login(usuarioInput, claveInput);
    
    if (isUsuario) {
        sessionStorage.setItem('usuarioLogueado', isUsuario.username);
        sessionStorage.setItem('token', isUsuario.accessToken);
        if (isUsuario.role) sessionStorage.setItem('role', isUsuario.role);
        window.location.href = 'admin.html';
    } else {
        mostrarMensaje('Error en credenciales', 'danger');
    }
});