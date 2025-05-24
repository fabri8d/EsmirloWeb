function volver() {
    window.location.href = "inicio.html";
}

function crearCuenta() {
    alert("Cuenta registrada correctamente!");
    window.location.href = "inicio.html";
}


const form = document.getElementById("registerForm");
const responseBox = document.getElementById("response");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        username: document.getElementById("inputUserName").value.trim(),
        firstName: document.getElementById("inputName").value.trim(),
        lastName: document.getElementById("inputLastName").value.trim(),
        email: document.getElementById("inputEmail4").value.trim(),
        password: document.getElementById("inputPassword4").value.trim(),
    };
    try {
        const res = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const text = await res.text();
        let json;
        try {
            json = text ? JSON.parse(text) : {};
        } catch (e) {
            json = { error: "Respuesta no es JSON válida" };
        }

        if (!res.ok) {
            responseBox.textContent = "Error: " + (json.error || res.statusText);
            return;
        }

        responseBox.textContent = JSON.stringify(json, null, 2);
    } catch (error) {
        responseBox.textContent = "Error en la petición: " + error;
    }
});
