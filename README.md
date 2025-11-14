# IDW_04

GRUPO 04
Integrantes:

- Joya Diego
- Montenegro Nicolas
- Torres Nancy
- Troillan Romina


Informacion a tener en cuenta:

El sistema funciona con los roles de dummyjson. Si detecta que el usuario logeado tiene el rol admin se permite el acceso a todas las paginas del sitio(incluyendo un panel de admin), si el usuario es visitante(no esta logeado) o su rol es user solo puede acceder a index,contacto,institucional y reservas.

Usuarios de ejemplo para probar:

Con rol de admin

user: emylis
password: emylispass

Con rol de user

user: evelyns
password: evelynspass


Para poder hacer una reserva de un turno un usuario con el rol administrador tiene que haber creado previamente un turno con el estado disponible, al reservarse este turno pasa a estar no disponible.
