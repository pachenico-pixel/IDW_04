// 🔹 Ocultar el contenido temporalmente hasta verificar permisos
document.documentElement.style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const loginLogoutBtn = document.getElementById("loginLogoutBtn");
  const userInfo = document.getElementById("userInfo");
  const adminBtn = document.getElementById("adminBtn"); 

  // 🔹 Función para actualizar la UI según el estado del login
function actualizarVista() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && (user.accessToken || user.token)) {
    // Mostrar botón de logout
    if (loginLogoutBtn) {
      loginLogoutBtn.innerHTML = '<i class="bi bi-box-arrow-right me-2"></i>Salir';
      loginLogoutBtn.classList.remove('boton-login');
      loginLogoutBtn.classList.add('boton-logout');
    }

    // Mostrar botón admin solo si el rol es admin
    if (adminBtn) {
      const userRole = user.role ? user.role.toLowerCase() : "";
      if (userRole === "admin") {
        adminBtn.classList.remove("d-none");
        adminBtn.classList.add("boton-admin");
      } else {
        adminBtn.classList.add("d-none");
      }
    }
  } else {
    // Usuario no logueado
    if (userInfo) {
      userInfo.textContent = "";
    }
    if (loginLogoutBtn) {
      loginLogoutBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i> Ingresar';
      loginLogoutBtn.classList.remove('boton-logout');
      loginLogoutBtn.classList.add('boton-login');
    }
    // Ocultar admin si no esta logueado
    if (adminBtn) {
      adminBtn.classList.add("d-none");
    }
  }
}


  actualizarVista();

  if (loginLogoutBtn) {
    loginLogoutBtn.addEventListener("click", () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && (user.accessToken || user.token)) {
        localStorage.removeItem("user");
        actualizarVista();
      } else {
        window.location.href = "login.html";
      }
    });
  }

  // Restriccion de acceso segun rol
  const restrictedForUser = [
    "abmMedico.html",
    "obrasSociales.html",
    "especialidades.html",
    "turno.html",
    "admin.html",
  ];

  const currentPage = window.location.pathname.split("/").pop();
  let permitirAcceso = true;

  if (userData) {
    const userRole = userData.role ? userData.role.toLowerCase() : "user";
    if (userRole !== "admin" && restrictedForUser.includes(currentPage)) {
      permitirAcceso = false;
      alert("No tienes permiso para acceder a esta página.");
      window.location.href = "index.html";
    }
  } else if (restrictedForUser.includes(currentPage)) {
    permitirAcceso = false;
    window.location.href = "login.html";
  }

  if (permitirAcceso) {
    document.documentElement.style.display = "";
  }

  // 🆕 Redirección al panel admin
  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      window.location.href = "admin.html";
    });
  }
});
