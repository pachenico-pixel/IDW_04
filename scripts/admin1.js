import { protegerAdmin, obtenerUsuarioActual } from './obtenerUsuario.js';

(async () => {
    console.log('Iniciando carga de datos del administrador...');
    
    const container = document.getElementById('userData');
    

    const token = sessionStorage.getItem('token');
    console.log('Token encontrado:', token ? 'Sí' : 'No');
    

    const stayed = await protegerAdmin({ redirect: false, stayAndShowSelector: '#userData' });

    if (!stayed) {
        console.log('No pasó la protección de admin');
        return;
    }

    console.log('Protección pasada, obteniendo usuario...');


    const user = await obtenerUsuarioActual();
    console.log('Usuario obtenido:', user);

    if (!user) {
        container.innerHTML = '<div class="alert alert-danger" role="alert">No se pudo obtener información del usuario.</div>';
        return;
    }


    container.innerHTML = `
        <ul class="list-group list-group-flush text-start">
            <li class="list-group-item"><strong>ID:</strong> ${user.id ?? ''}</li>
            <li class="list-group-item"><strong>Nombre:</strong> ${user.firstName ?? ''} ${user.lastName ?? ''}</li>
            <li class="list-group-item"><strong>Usuario:</strong> ${user.username ?? ''}</li>
            <li class="list-group-item"><strong>Email:</strong> ${user.email ?? ''}</li>
            <li class="list-group-item"><strong>Rol:</strong> ${user.role ?? '—'}</li>
        </ul>
    `;

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