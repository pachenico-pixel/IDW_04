export async function obtenerUsuarioActual() {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No se encontró token en sessionStorage (key: "token").');
      return null;
    }

    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

    const resp = await fetch('https://dummyjson.com/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!resp.ok) {
      console.error('Error al consultar /auth/me:', resp.status, resp.statusText);
      return null;
    }

    const user = await resp.json();
    return user;
  } catch (err) {
    console.error('Excepción al obtener usuario desde DummyJSON:', err);
    return null;
  }
}

export async function obtenerRolDesdeDummy() {
  const u = await obtenerUsuarioActual();
  if (!u) return null;
  return u.role || null;
}


export async function protegerAdmin(options = {}) {
  const {
    redirect = true,
    redirectUrl = 'loginMedicos.html',
    stayAndShowSelector = null,
    message = 'Acceso restringido: se requiere rol admin'
  } = options;

  try {
    const role = await obtenerRolDesdeDummy();
    const isAdmin = role === 'admin';

    if (!isAdmin) {
      if (redirect) {
        window.location.href = redirectUrl;
        return false;
      }

      if (stayAndShowSelector) {
        try {
          const el = document.querySelector(stayAndShowSelector);
          if (el) {
            el.innerHTML = `<div style="color: red; font-weight: bold;">${message}</div>`;
          } else {
            alert(message);
          }
        } catch (e) {
          console.error('Error al mostrar mensaje en selector:', e);
          alert(message);
        }
      } else {
        alert(message);
      }

      return false;
    }
    return true;
  } catch (err) {
    console.error('Error al verificar rol admin:', err);
    if (redirect) window.location.href = redirectUrl;
    return false;
  }
}