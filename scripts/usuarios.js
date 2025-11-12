document.addEventListener('DOMContentLoaded', async() => {
    const tablaUsuariosBody = document.querySelector('#tablaUsuarios tbody')

    try {
        const response = await fetch('https://dummyjson.com/users');
        if (response.ok) {
            const data = await response.json();
            const usuarios = data.users;

            usuarios.forEach((element) => {
                const fila = document.createElement('tr');
                fila.innerHTML =  `
                    <td>${element.firstName}</td>
                    <td>${element.username}</td>
                    <td>${element.email}</td>
                    <td>${element.phone}</td>
                `;
                tablaUsuariosBody.appendChild(fila);
            });
        } else {
            console.error(response.status);
            throw Error("Error al listar usuarios");
        }
    } catch(error){
        console.error("Error",error);
        Alert("Error en la Api Dummy");
        
    }
})