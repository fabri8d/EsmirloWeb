import { checkSession, logout } from "../utils/sessions.js";
import { contadorCarrito } from "../utils/carts.js";
import { loadCategories } from "../utils/categories.js";
document.addEventListener('DOMContentLoaded', () => {
    if (!checkSession()) return;
    contadorCarrito();
    loadCategories();
});
document.getElementById('form-suscripcion')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  if (!username || !token) {
    alert('No se encontró el usuario o el token. Por favor, inicia sesión nuevamente.');
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/users/subscribe/${username}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
    });

    if (!res.ok) throw new Error('Error en la suscripción');

    this.reset();
    const mensaje = document.getElementById('mensajeSuscripcion');
    mensaje.classList.remove('d-none');
    setTimeout(() => mensaje.classList.add('d-none'), 4000);
  } catch (error) {
    console.error('Ya se encuentra subscripto ', error.message);
    alert('Ya se encuentra subscripto.');
  }
});
window.logout = logout;