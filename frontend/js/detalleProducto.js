import { checkSession, logout, adminOnly } from "../utils/sessions.js";
import	 { contadorCarrito } from "../utils/carts.js";
import { loadCategories } from "../utils/categories.js";
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
let productoActual = null;
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async () => {
  if (!checkSession()) return;
  adminOnly();
  contadorCarrito();
  loadCategories()
  if (!productId) {
    document.getElementById("detalle-producto").innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/products/getProductById/${productId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const producto = await res.json();
    productoActual = producto;

    const colores = [...new Set(producto.variants.map(v => v.color))];

    document.getElementById("detalle-producto").innerHTML = `
      <div class="card mb-3">
        <img src="${producto.imageUrl}" class="card-img-top" alt="${producto.name}" />
        <div class="card-body">
          <h5 class="card-title">${producto.name}</h5>
          <p class="card-text">Categoria: ${producto.category.name}</p>
          <p class="card-text">Precio: $${producto.price}</p>
          <p class="card-text">Descripcion:</p>
          <p class="card-text">${producto.description}</p>
          

          <div class="mb-2">
            <label for="select-color" class="form-label">Color</label>
            <select class="form-select" id="select-color">
              <option value="">Seleccione un color</option>
              ${colores.map(c => `<option value="${c}">${c}</option>`).join("")}
            </select>
          </div>

          <div class="mb-2">
            <label for="select-talle" class="form-label">Tamaño</label>
            <select class="form-select" id="select-talle" disabled>
              <option value="">Seleccione un talle</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="input-cantidad" class="form-label">
              Cantidad (<span id="stock-disponible">-</span> disponibles)
            </label>
            <input type="number" class="form-control" id="input-cantidad" min="1" value="1" disabled />
          </div>

          <button class="btn btn-primary" id="btn-agregar" disabled>Agregar al carrito</button>
        </div>
      </div>
    `;

    const colorSelect = document.getElementById("select-color");
    const talleSelect = document.getElementById("select-talle");
    const cantidadInput = document.getElementById("input-cantidad");
    const stockDisplay = document.getElementById("stock-disponible");
    const btnAgregar = document.getElementById("btn-agregar");

    colorSelect.addEventListener("change", () => {
      const color = colorSelect.value;
      if (!color) {
        talleSelect.innerHTML = `<option value="">Seleccione un talle</option>`;
        talleSelect.disabled = true;
        cantidadInput.disabled = true;
        btnAgregar.disabled = true;
        stockDisplay.textContent = "-";
        return;
      }

      const talles = [...new Set(producto.variants.filter(v => v.color === color).map(v => v.size))];
      talleSelect.innerHTML = `<option value="">Seleccione un talle</option>` +
        talles.map(t => `<option value="${t}">${t}</option>`).join("");
      talleSelect.disabled = false;
      cantidadInput.disabled = true;
      btnAgregar.disabled = true;
      stockDisplay.textContent = "-";
    });

    talleSelect.addEventListener("change", () => {
      const color = colorSelect.value;
      const talle = talleSelect.value;
      const variant = producto.variants.find(v => v.color === color && v.size === talle);

      if (variant) {
        cantidadInput.max = variant.stock;
        cantidadInput.value = 1;
        cantidadInput.disabled = variant.stock === 0;
        btnAgregar.disabled = variant.stock === 0;
        stockDisplay.textContent = variant.stock;
      } else {
        cantidadInput.disabled = true;
        btnAgregar.disabled = true;
        stockDisplay.textContent = "0";
      }
    });

    btnAgregar.addEventListener("click", () => {
      const color = colorSelect.value;
      const talle = talleSelect.value;
      const cantidad = parseInt(cantidadInput.value) || 1;

      if (!color || !talle) {
        alert("Por favor seleccione color y talle.");
        return;
      }

      const variant = producto.variants.find(v => v.color === color && v.size === talle);
      if (!variant) {
        alert("Variante no válida.");
        return;
      }

      if (cantidad < 1 || cantidad > variant.stock) {
        alert("Cantidad inválida o supera el stock disponible.");
        return;
      }
      agregarAlCarrito(variant.id, cantidad);
    });

  } catch (error) {
    console.error("Error al cargar el producto", error);
    document.getElementById("detalle-producto").innerHTML = "<p>Error al cargar el producto.</p>";
  }
});

async function agregarAlCarrito(variantId, quantity) {
  try {
    const res = await fetch('http://localhost:3000/cart/addProductToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ variantId, quantity })
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert("Error al agregar al carrito: " + (errorData.message || res.statusText));
      return;
    }
    contadorCarrito()
  } catch (error) {
    console.error(error);
    alert("Error al agregar al carrito");
  }
}

window.logout = logout;