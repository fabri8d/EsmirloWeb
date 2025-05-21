function irPrincipal(){
    window.location.href = "../pages/principal.html"; // ✅ Ruta absoluta desde el servidor
}

document.getElementById("loginForm").addEventListener("submit", async e => {
      e.preventDefault();
      const username = document.getElementById("usuario").value.trim();
      const password = document.getElementById("contrasena").value.trim();
      const loginMessage = document.getElementById("login-message");

      try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          loginMessage.style.color = "red";
          loginMessage.textContent = data.error || "Login fallido.";
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        irPrincipal()

      } catch (err) {
        loginMessage.style.color = "red";
        loginMessage.textContent = "Error de conexión.";
      }
    });