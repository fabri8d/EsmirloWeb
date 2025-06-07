import { checkSession, logout } from "../utils/sessions.js";
import	 { updateCartCount } from "../utils/carts.js";
import { loadCategories } from "../utils/categories.js";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
document.addEventListener('DOMContentLoaded', () => {
    if (!checkSession()) return;
    adminOnly();
    updateCartCount();
    loadCategories()
    cargarProductos()
});


// Función para actualizar el contador en la navbar

function adminOnly() {
    if (role !== "admin") {
        document.getElementById("admin-panel").remove("d-none");
    }
}

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
    <a href="detalle-redistribuccion.html?id=${producto._id}" class="btn btn-primary btn-sm">Ver detalle</a>


  </div>
</div>

      `;
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}


//Redireccion


document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/products");
    const productos = await res.json();

    const contenedor = document.getElementById("productos-container");
    contenedor.innerHTML = "";

    productos.forEach((producto) => {
      const card = document.createElement("div");
      card.className = "card m-2";
      card.style.width = "18rem";
      card.style.cursor = "pointer";
      card.innerHTML = `
        <img src="${producto.imageUrl}" class="card-img-top" alt="${producto.name}">
        <div class="card-body">
          <h5 class="card-title">${producto.name}</h5>
          <p class="card-text">${producto.description}</p>
          <p class="card-text"><strong>Precio:</strong> $${producto.price}</p>
        </div>
      `;
      card.addEventListener("click", () => {
window.location.href = `frontend\pages\detalle-redistribucion.html?id=${producto._id}`;
      });

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar productos", error);
  }
});

window.logout = logout 
