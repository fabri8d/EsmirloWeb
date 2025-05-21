document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el envío del formulario
    irPrincipal();
});

function irPrincipal(){
    window.location.href = "/principal.html"; // ✅ Ruta absoluta desde el servidor
}
