import { checkSession, logout } from "../utils/sessions.js";
import { contadorCarrito } from "../utils/carts.js";
import { loadCategories } from "../utils/categories.js";
import { redireccionProductos } from "../utils/products.js";
const token = localStorage.getItem("token");
let pagina = 1;
const limite = 6;

document.addEventListener('DOMContentLoaded', () => {
  if (!checkSession()) return;
  cargarProductos(pagina);
  contadorCarrito();
  loadCategories();

  document.getElementById("btnAnterior").addEventListener("click", () => {
    if (pagina > 1) cargarProductos(--pagina);
  });

  document.getElementById("btnSiguiente").addEventListener("click", () => {
    cargarProductos(++pagina);
  });
});

async function cargarProductos(paginaActual = 1) {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("nombre");
  if (!categoria) {
    document.getElementById("titulo-categoria").textContent = "Categoría no especificada";
    return;
  }

  document.getElementById("titulo-categoria").textContent = `Categoría: ${categoria}`;
  const query = new URLSearchParams({
    page: paginaActual,
    limit: limite,
  });

  try {
    const res = await fetch(`http://localhost:3000/products/getProductsByCategory/${encodeURIComponent(categoria)}?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const { products, total } = await res.json();
    const totalPaginas = Math.ceil(total / limite);

    const contenedor = document.getElementById("productos-contenedor");
    contenedor.innerHTML = "";

    products.forEach(p => {
      const col = document.createElement("div");
      col.className = "col";
      col.innerHTML = `
        <div class="card h-100">
          <img src="${p.imageUrl}" class="card-img-top" alt="${p.name}" />
          <div class="card-body text-center">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text text-success fw-bold">$${p.price}</p>
            <a onClick="redireccionProductos('${p.id}')" class="btn btn-primary btn-sm">Ver detalle</a>
          </div>
        </div>`;
      contenedor.appendChild(col);
    });

    // Paginación
    document.getElementById("btnAnterior").disabled = paginaActual <= 1;
    document.getElementById("btnSiguiente").disabled = paginaActual >= totalPaginas;
    document.getElementById("paginaActual").textContent = `Página ${paginaActual} de ${totalPaginas}`;
  } catch (err) {
    console.error("Error al cargar productos:", err.message);
  }
}

window.logout = logout;
window.redireccionProductos = redireccionProductos;