import { checkSession, logout } from "../utils/sessions.js";
const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", () => {

  if (!checkSession()) return;
  cargarProductos();
});

async function cargarProductos() {
  const contenedor = document.getElementById("productos-container");

  try {
    const response = await fetch("http://localhost:3000/products/getProducts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron obtener los productos.");
    }

    const productos = await response.json();

    productos.forEach((producto) => {
      const row = document.createElement("div");
      row.classList.add("row", "mb-4");

      row.innerHTML = `
        <div class="col">
          <div class="card">
            <img src="${producto.imageUrl}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${producto.name}">
            <div class="card-body">
              <h5 class="card-title">${producto.name}</h5>
              <p class="card-text">Categoria: ${producto.category.name}</p>
              <p class="card-text">Descripcion: ${producto.description}</p>
              <div class="d-flex align-items-center mb-2">
                <strong class="me-2">Precio: $</strong>
                <input type="number" id="precio-${producto.id}" value="${producto.price}" min="0" style="width: 100px;" class="form-control form-control-sm me-2">
                <button class="btn btn-sm btn-primary" onclick="cambiarPrecio('${producto.id}')">Actualizar</button>
              </div>

              <button class="btn btn-sm btn-success mb-2" onclick="toggleFormularioAgregar('${producto.id}')">Agregar variante</button>
              <button class="btn btn-sm btn-secondary mb-2" onclick="toggleVariantes('${producto.id}')">Ver variantes</button>
              <button class="btn btn-sm btn-danger mb-2" onclick="eliminarProducto('${producto.id}')">Eliminar producto</button>

              <div id="formulario-${producto.id}" style="display: none;" class="mb-3">
                <div class="mb-2">
                  <input type="text" id="color-${producto.id}" class="form-control mb-1" placeholder="Color">
                  <input type="text" id="size-${producto.id}" class="form-control mb-1" placeholder="Tamaño">
                  <input type="number" id="stockNuevo-${producto.id}" class="form-control mb-1" placeholder="Stock" min="0">
                  <button class="btn btn-sm btn-primary" onclick="crearVariante('${producto.id}')">Confirmar</button>
                </div>
              </div>

              <div id="variantes-${producto.id}" style="display: none; margin-top: 10px;">
                <h6>Variantes:</h6>
                ${producto.variants.map(variant => `
                  <div class="border rounded p-2 mb-2">
                    <p class="mb-1">Talle: ${variant.size}</p>
                    <p class="mb-1">Color: ${variant.color}</p>
                    <p class="mb-1">Stock: 
                      <input type="number" id="stock-${variant.id}" value="${variant.stock}" min="0" style="width: 80px;">
                    </p>
                    <button class="btn btn-sm btn-primary me-2" onclick="actualizarVarianteStock(${variant.id})">Actualizar stock</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarVariante(${variant.id})">Eliminar variante</button>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
      `;

      contenedor.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    contenedor.innerHTML = `<p class="text-danger">Error al cargar productos.</p>`;
  }
}
function toggleVariantes(productId) {
  const div = document.getElementById(`variantes-${productId}`);
  div.style.display = div.style.display === "none" ? "block" : "none";
}

function toggleFormularioAgregar(productId) {
  const form = document.getElementById(`formulario-${productId}`);
  form.style.display = form.style.display === "none" ? "block" : "none";
}


async function crearVariante(productId) {
  const color = document.getElementById(`color-${productId}`).value.trim();
  const size = document.getElementById(`size-${productId}`).value.trim();
  const stock = parseInt(document.getElementById(`stockNuevo-${productId}`).value);

  if (!color || !size || isNaN(stock)) {
    alert("Por favor, completá todos los campos correctamente.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/products/createVariant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ productId, color, size, stock }),
    });

    if (!response.ok) throw new Error();

    alert("Variante agregada correctamente.");
    location.reload();
  } catch (err) {
    alert("Error al agregar variante.");
  }
}

async function actualizarVarianteStock(variantId) {
  const nuevoStock = document.getElementById(`stock-${variantId}`).value;

  try {
    const response = await fetch(`http://localhost:3000/products/updateVariantStock/${variantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ stock: parseInt(nuevoStock) }),
    });

    if (!response.ok) throw new Error();

    alert("Stock actualizado correctamente.");
  } catch (err) {
    alert("Error al actualizar stock.");
  }
}

async function eliminarVariante(variantId) {
  const confirmacion = confirm("¿Estás seguro de que querés eliminar esta variante?");
  if (!confirmacion) return;

  try {
    const response = await fetch(`http://localhost:3000/products/deleteVariant/${variantId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error();

    alert("Variante eliminada.");
    location.reload();
  } catch (err) {
    alert("Error al eliminar variante.");
  }
}

async function eliminarProducto(productId) {
  const confirmacion = confirm("¿Estás seguro de que querés eliminar este producto?");
  if (!confirmacion) return;

  try {
    const response = await fetch(`http://localhost:3000/products/deleteProduct/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error();

    alert("Producto eliminado.");
    location.reload();
  } catch (err) {
    alert("Error al eliminar producto.");
  }
}

async function cambiarPrecio(productId) {
  const input = document.getElementById(`precio-${productId}`);

  const nuevoPrecio = parseFloat(input.value);
  if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
    alert("Por favor, ingresá un precio válido.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/products/changePrice/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ price: nuevoPrecio }),
    });

    if (!response.ok) throw new Error();

    document.getElementById(`precio-${productId}`).textContent = nuevoPrecio;
    alert("Precio actualizado correctamente.");
  } catch (err) {
    alert("Error al actualizar precio.");
  }
}

window.toggleVariantes = toggleVariantes;
window.toggleFormularioAgregar = toggleFormularioAgregar;
window.crearVariante = crearVariante;
window.actualizarVarianteStock = actualizarVarianteStock;
window.eliminarVariante = eliminarVariante;
window.eliminarProducto = eliminarProducto;
window.cambiarPrecio = cambiarPrecio;
window.logout = logout;
