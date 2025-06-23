import { checkSession, logout, adminOnly } from "../utils/sessions.js";
import { contadorCarrito } from "../utils/carts.js";
import { loadCategories } from "../utils/categories.js";
import { redireccionProductos } from "../utils/products.js";

const token = localStorage.getItem("token");
let pagina = 1;
const limite = 6;

document.addEventListener("DOMContentLoaded", () => {
  if (!checkSession()) return;
  adminOnly();
  contadorCarrito();
  loadCategories();
  cargarProductos(pagina);

  document.getElementById("btnAnterior")?.addEventListener("click", () => {
    if (pagina > 1) cargarProductos(--pagina);
  });

  document.getElementById("btnSiguiente")?.addEventListener("click", () => {
    cargarProductos(++pagina);
  });
});

async function cargarProductos(paginaActual = 1) {
  try {
    const res = await fetch(`http://localhost:3000/products/getProducts?page=${paginaActual}&limit=${limite}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { data: productos, page: currentPage, totalPages } = await res.json();

    const contenedor = document.getElementById("productos-container");
    contenedor.innerHTML = "";

    productos.forEach((p) => {
      const col = document.createElement("div");
      col.className = "col";
      col.innerHTML = `
        <div class="card h-100">
          <img src="${p.imageUrl}" class="card-img-top" alt="${p.name}" />
          <div class="card-body text-center">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text mb-1">Categoría: <span class="text-secondary">${p.category?.name || 'Sin categoría'}</span></p>
            <p class="card-text text-success fw-bold">$${p.price}</p>
            <a onClick="redireccionProductos('${p.id}')" class="btn btn-primary btn-sm">Ver detalle</a>
          </div>
        </div>`;
      contenedor.appendChild(col);
    });

    document.getElementById("btnAnterior").disabled = currentPage <= 1;
    document.getElementById("btnSiguiente").disabled = currentPage >= totalPages;
    document.getElementById("paginaActual").textContent = `Página ${currentPage} de ${totalPages}`;
  } catch (error) {
    console.error("Error al cargar productos:", error.message);
  }
}

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
window.redireccionProductos = redireccionProductos;
