import { checkSession, logout } from "../utils/sessions.js";
import { updateCartCount } from "../utils/carts.js";
import { loadCategories } from "../utils/categories.js";
const token = localStorage.getItem("token");

document.addEventListener('DOMContentLoaded', () => {
  if (!checkSession()) return;
    cargarProductos()
    updateCartCount();
    loadCategories();
});


async function cargarProductos() {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("nombre");
    
    if (!categoria) {
      document.getElementById("titulo-categoria").textContent = "Categoría no especificada";
      return;  // Salir para no hacer fetch con categoría indefinida
    }
    
    document.getElementById("titulo-categoria").textContent = `Categoría: ${categoria}`;

    
    try {
        const res = await fetch(`http://localhost:3000/products/getProductsByCategory/${encodeURIComponent(categoria)}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        );
        const productos = await res.json();

        const contenedor = document.getElementById("productos-contenedor");
        contenedor.innerHTML = "";

        productos.forEach(p => {
            const col = document.createElement("div");
            col.className = "col";
            col.innerHTML = `
            <div class="card h-100">
              <img src="${p.imageUrl}" class="card-img-top" alt="${p.name}" />
              <div class="card-body text-center">
                <h5 class="card-title">${p.name}</h5>
                <p class="card-text text-success fw-bold">$${p.price}</p>
                <a href="#" class="btn btn-primary btn-sm btn-agregar-carrito">Ver detalle</a>
              </div>
            </div>
          `;
            contenedor.appendChild(col);
        });

    } catch (err) {
        console.error("Error al cargar productos:", err.message);
    }
}


window.logout = logout 