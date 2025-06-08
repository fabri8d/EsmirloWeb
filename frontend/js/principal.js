import { checkSession, logout, adminOnly } from "../utils/sessions.js";
import	 { contadorCarrito } from "../utils/carts.js";
import { loadCategories } from "../utils/categories.js";
import { redireccionProductos } from "../utils/products.js";
const token = localStorage.getItem("token");
document.addEventListener('DOMContentLoaded', () => {
    if (!checkSession()) return;
    adminOnly();
    contadorCarrito();
    loadCategories()
    cargarProductos()
});



async function cargarProductos() {
    try {
        const res = await fetch("http://localhost:3000/products/getProducts", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const productos = await res.json();

        const contenedor = document.getElementById('productos-container');
        contenedor.innerHTML = '';

        productos.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'col';
            card.innerHTML = `
        <div class="card h-100">
  <img src="${producto.imageUrl}" class="card-img-top" alt="${producto.name}" />
  <div class="card-body text-center">
    <h5 class="card-title">${producto.name}</h5>
    <p class="card-text mb-1">Categoría: <span class="text-secondary">${producto.category?.name || 'Sin categoría'}</span></p>
    <p class="card-text text-success fw-bold">$${producto.price}</p>
    <a onClick="redireccionProductos('${producto.id}')" class="btn btn-primary btn-sm">Ver detalle</a>
  </div>
</div>`;
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

window.logout = logout;
window.redireccionProductos = redireccionProductos;