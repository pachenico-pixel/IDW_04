import { obtenerUsuarioActual } from './obtenerUsuario.js';

(async () => {
    console.log('Iniciando carga de datos del paciente...');
    
    const container = document.getElementById('userData');
    
    const token = sessionStorage.getItem('token');
    console.log('Token encontrado:', token ? 'Sí' : 'No');
    
    if (!token) {
        container.innerHTML = '<div class="alert alert-danger" role="alert">No has iniciado sesión.</div>';
        setTimeout(() => {
            window.location.replace('index.html');
        }, 2000);
        return;
    }

    const role = sessionStorage.getItem('role');
    
    // Verificar que no sea admin
    if (role === 'admin') {
        container.innerHTML = '<div class="alert alert-danger" role="alert">Los administradores no pueden acceder a esta página.</div>';
        setTimeout(() => {
            window.location.replace('index.html');
        }, 2000);
        return;
    }

    console.log('Verificación pasada, obteniendo usuario...');

    // Obtener y mostrar datos
    const user = await obtenerUsuarioActual();
    console.log('Usuario obtenido:', user);

    if (!user) {
        container.innerHTML = '<div class="alert alert-danger" role="alert">No se pudo obtener información del usuario.</div>';
        return;
    }

    // Mostrar datos básicos del usuario
    container.innerHTML = `
        <ul class="list-group list-group-flush text-start">
            <li class="list-group-item"><strong>ID:</strong> ${user.id ?? ''}</li>
            <li class="list-group-item"><strong>Nombre:</strong> ${user.firstName ?? ''} ${user.lastName ?? ''}</li>
            <li class="list-group-item"><strong>Usuario:</strong> ${user.username ?? ''}</li>
            <li class="list-group-item"><strong>Email:</strong> ${user.email ?? ''}</li>
            <li class="list-group-item"><strong>Rol:</strong> ${user.role ?? 'Paciente'}</li>
        </ul>
    `;

    // Manejar el botón de cerrar sesión
    const logoutLinks = document.querySelectorAll('a[href="index.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('usuarioLogueado');
            sessionStorage.removeItem('role');
            window.location.replace('index.html');
        });
    });
})();