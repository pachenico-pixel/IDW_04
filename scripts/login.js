document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMsg = document.getElementById("loginError");
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.classList.add("d-none");
    errorMsg.textContent = "";

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      errorMsg.textContent = "Ingrese usuario y contraseña.";
      errorMsg.classList.remove("d-none");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Ingresando...";

    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const loginData = await res.json();

      if (!res.ok || !loginData.accessToken) {
        throw new Error("Error al iniciar sesión");
      }

      const userRes = await fetch(`https://dummyjson.com/users/${loginData.id}`);
      const userDataFull = await userRes.json();

      const userData = {
        id: loginData.id,
        username: loginData.username,
        firstName: loginData.firstName || userDataFull.firstName,
        email: loginData.email || userDataFull.email,
        role: userDataFull.role,
        accessToken: loginData.accessToken,
        refreshToken: loginData.refreshToken,
      };

      // 🔹 Paso 4: Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // 🔹 Paso 5: Redirigir
      window.location.href = "index.html";

    } catch (err) {
      errorMsg.textContent = err.message || "Error al iniciar sesion";
      errorMsg.classList.remove("d-none");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Ingresar";
    }
  });
});
