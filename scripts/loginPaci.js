import { login } from "./auth.js";


const formLoginPaci = document.getElementById('formLoginPaci');
const usuario = document.getElementById('usuario');
const clave = document.getElementById('contrasenia');

function mostrarMensaje(texto, tipo) {
    const prev = document.querySelector('.alert');
    if (prev) prev.remove();
    
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `alert alert-${tipo}`;
    mensajeDiv.textContent = texto;
    
    const container = document.querySelector('.card');
    container.insertBefore(mensajeDiv, formLoginPaci);
}

function obtenerRole(obj) {
    if (!obj) return null;
    const raw = obj.role ?? obj.rol ?? obj.ROL ?? obj.Rol ?? '';
    return String(raw).toLowerCase();
}
function obtenerNombreUsuario(obj) {
    return obj.username ?? obj.usuario ?? obj.user ?? obj.email ?? '';
}

formLoginPaci.addEventListener('submit', async function (event) {
    event.preventDefault();
    
    let usuarioInput = usuario.value.trim();
    let claveInput = clave.value.trim();

    if (!usuarioInput || !claveInput) {
        mostrarMensaje('Completa usuario y contraseña', 'warning');
        return;
    }

    // Verificar pacientes locales en sessionStorage
    let pacientes = JSON.parse(sessionStorage.getItem('pacientes')) || [];
    console.log('Pacientes en storage:', pacientes);
    
    let pacienteLocal = pacientes.find(p => (p.usuario === usuarioInput || p.username === usuarioInput) && p.clave === claveInput);
    console.log('Paciente local encontrado:', pacienteLocal);
    
    if (pacienteLocal) {
        const roleLocal = obtenerRole(pacienteLocal);
        console.log('Rol del paciente local:', roleLocal);
        

        if (roleLocal === 'admin') {
            mostrarMensaje('Está registrado como profesional. Debe iniciar sesión por el portal de profesionales', 'warning');
            return;
        }
        
        sessionStorage.setItem('usuarioLogueado', obtenerNombreUsuario(pacienteLocal) || pacienteLocal.usuario);
        sessionStorage.setItem('token', 'local-token-' + Date.now());
        if (roleLocal) sessionStorage.setItem('role', roleLocal);
        window.location.href = 'paciente.html';
        return;
    }

    const isUsuario = await login(usuarioInput, claveInput);
    console.log('Usuario desde API:', isUsuario);
    
    if (isUsuario) {
        const roleApi = obtenerRole(isUsuario);
        console.log('Rol del usuario API:', roleApi);

        if (roleApi === 'admin') {
            mostrarMensaje('Está registrado como profesional. Debe iniciar sesión por el portal de profesionales', 'warning');
            return;
        }
        
        sessionStorage.setItem('usuarioLogueado', obtenerNombreUsuario(isUsuario) || isUsuario.username || usuarioInput);
        sessionStorage.setItem('token', isUsuario.accessToken ?? ('api-token-' + Date.now()));
        if (roleApi) sessionStorage.setItem('role', roleApi);
        window.location.href = 'paciente.html';
    } else {
        mostrarMensaje('Error en credenciales', 'danger');
    }
});