import { checkSession } from "../utils/sessions.js";
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");
document.addEventListener('DOMContentLoaded', () => {
  if (!checkSession()) return;
  cargarCarrito();
  configurarMetodoEnvio();
  cargarPedidosUsuario();
});

async function cargarCarrito() {
  try {
    const res = await fetch('http://localhost:3000/cart/getCart', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const carrito = await res.json();
    const items = carrito.items || [];

    const cartItemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    cartItemsDiv.innerHTML = '';
    let total = 0;

    cartCount.textContent = items.length;

    if (items.length === 0) {
      document.getElementById('carrito-compra').classList.add('d-none');
      document.getElementById('resumen-compra').classList.remove('d-none');
      cartItemsDiv.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
      totalSpan.textContent = "0.00";
      actualizarCostoEnvioYTotal(0);
      return;
    }

    items.forEach(item => {
      const precio = Number(item.price);
      const subtotal = precio * item.quantity;
      total += subtotal;
      const talles = ['S', 'M', 'L', 'XL', 'XXL'];
      const itemHTML = `
        <div class="col-12 card p-3 shadow-sm" id="item-${item.id}">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5>${item.productVariant.product.name}</h5>
              <p class="mb-1">Precio: $${precio.toFixed(2)}</p>
              <p class="mb-1">Talle: <strong>${item.productVariant.size}</strong></p>
              <p class="mb-1">Cantidad: <strong>${item.quantity}</strong></p>
              <div class="mb-2 d-none" id="edit-section-${item.id}">
                <label>Talle:</label>
                <select id="edit-size-${item.id}" class="form-select form-select-sm mb-1 w-50">
                  ${talles.map(t => `<option value="${t}" ${t === item.productVariant.size ? "selected" : ""}>${t}</option>`).join('')}
                </select>
                <label>Cantidad:</label>
                <input type="number" min="1" class="form-control form-control-sm w-50" id="edit-quantity-${item.id}" value="${item.quantity}">
              </div>
            </div>
            <div class="text-end">
              <p class="fw-bold">Subtotal: $${subtotal.toFixed(2)}</p>
              <button class="btn btn-warning btn-sm" onclick="mostrarEditor(${item.id})">Editar</button>
              <button class="btn btn-success btn-sm d-none" id="save-${item.id}" onclick="guardarCambios(${item.id})">Guardar</button><br>
              <button class="btn btn-danger btn-sm mt-1" onclick="eliminarProducto(${item.id})">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      cartItemsDiv.innerHTML += itemHTML;
    });

    totalSpan.textContent = total.toFixed(2);
    document.getElementById('carrito-compra').classList.remove('d-none');
    document.getElementById('resumen-compra').classList.add('d-none');

    actualizarCostoEnvioYTotal(total);

  } catch (error) {
    console.error("Error al cargar el carrito:", error);
  }
}

function mostrarEditor(id) {
  document.getElementById(`edit-section-${id}`).classList.remove('d-none');
  document.getElementById(`save-${id}`).classList.remove('d-none');
}

async function guardarCambios(id) {
  const nuevaCantidad = parseInt(document.getElementById(`edit-quantity-${id}`).value);
  const nuevoTalle = document.getElementById(`edit-size-${id}`).value;

  try {
    await fetch(`http://localhost:3000/cart/updateCartItem/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity: nuevaCantidad, size: nuevoTalle })
    });
    cargarCarrito();
  } catch (error) {
    console.error("Error al guardar cambios:", error);
  }
}

async function eliminarProducto(id) {
  try {
    await fetch(`http://localhost:3000/cart/removeCartItem/${id}`, {
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token}` }
    });
    cargarCarrito();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

document.getElementById("confirmar-compra").addEventListener("click", async () => {
  try {
    const res = await fetch('http://localhost:3000/cart/getCart', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const carrito = await res.json();
    const items = carrito.items || [];
    if (items.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    let metodoEntrega = document.getElementById('metodo-envio').value;
    const direccion = document.getElementById('direccion').value;
    const provincia = document.getElementById('provincia').value;
    const cp = document.getElementById('codigo-postal').value;

    if (
      metodoEntrega === "Envío a domicilio" &&
      (!direccion.trim() || !provincia.trim() || !cp.trim())
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (metodoEntrega === "Envío a domicilio") {
      metodoEntrega = "home_delivery";
    } else {
      metodoEntrega = "store_pickup";
    }

    const payload = {
      cartId: carrito.id,
      deliveryMethod: metodoEntrega,
      address: direccion,
      province: provincia,
      postalCode: cp,
    };

    const resOrder = await fetch('http://localhost:3000/orders/createOrder', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!resOrder.ok) {
      const err = await resOrder.json();
      throw new Error(err.message || "Error al crear el pedido.");
    }

    await fetch(`http://localhost:3000/cart/updateCartStatus/${carrito.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ newStatus: "confirmed" })
    });

    cargarCarrito();
    document.getElementById('carrito-compra').classList.add('d-none');
    document.getElementById('resumen-compra').classList.remove('d-none');
  }
  catch (error) {
    console.error("Error al confirmar compra:", error);
    alert("Ocurrió un error al confirmar la compra. Por favor, inténtalo de nuevo.");
  }
});

function configurarMetodoEnvio() {
  const metodoEnvio = document.getElementById("metodo-envio");
  metodoEnvio.addEventListener("change", () => {
    const mostrar = metodoEnvio.value === "Envío a domicilio";
    document.getElementById("campo-direccion").classList.toggle("d-none", !mostrar);
    document.getElementById("campo-provincia").classList.toggle("d-none", !mostrar);
    document.getElementById("campo-codigo-postal").classList.toggle("d-none", !mostrar);
    const total = parseFloat(document.getElementById("cart-total").textContent) || 0;
    actualizarCostoEnvioYTotal(total);
  });
}

function actualizarCostoEnvioYTotal(subtotal) {
  const metodo = document.getElementById("metodo-envio").value;
  const envio = metodo === "Envío a domicilio" ? 2500 : 0;
  document.getElementById("costo-envio").textContent = `Costo de envío: $${envio.toFixed(2)}`;
  document.getElementById("total-final").textContent = `Total final: $${(subtotal + envio).toFixed(2)}`;
}

async function cargarPedidosUsuario() {
  try {
    const res = await fetch(`http://localhost:3000/orders/getOrdersByUsername/${username}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const pedidos = await res.json();
    const contenedor = document.getElementById("orders-list");
    contenedor.innerHTML = "";

    if (!pedidos.length) {
      contenedor.innerHTML = `<p>No hay pedidos registrados.</p>`;
      return;
    }

    pedidos.forEach((pedido, index) => {
      const fecha = new Date(pedido.createdAt).toLocaleDateString();
      let estado = pedido.status;
      const total = pedido.totalAmount;
      const metodo = pedido.deliveryMethod === "home_delivery" ? "A domicilio" : "Retiro en tienda";

      if (estado === "cancelled") estado = "Cancelado";
      else if (estado === "completed") estado = "Entregado";
      else if (estado === "pending") estado = "Pendiente";
      else if (estado === "paid") estado = "Pago realizado";
      else if (estado === "shipped") estado = "Enviado";

      const itemsHTML = pedido.items && pedido.items.length > 0 ? `
        <div class="mt-3 d-none" id="productos-${pedido.id}">
          <h6>Productos:</h6>
          <ul class="list-group">
            ${pedido.items.map(item => `
              <li class="list-group-item">
                <strong>${item.productName}</strong> - 
                Color: ${item.variantColor}, 
                Talla: ${item.variantSize}, 
                Cantidad: ${item.variantQuantity}
              </li>
            `).join("")}
          </ul>
        </div>
      ` : "";

      const pedidoHTML = `
        <div class="card mb-3 p-3 shadow-sm">
          <h5>Pedido #${pedido.id}</h5>
          <p><strong>Fecha:</strong> ${fecha}</p>
          <p><strong>Método de envío:</strong> ${metodo}</p>
          <p><strong>Total:</strong> $${total}</p>
          <p><strong>Estado:</strong> ${estado}</p>
          <button class="btn btn-sm btn-primary" onclick="toggleProductos(${pedido.id})">Ver/Ocultar productos</button>
          ${itemsHTML}
        </div>
      `;

      contenedor.innerHTML += pedidoHTML;
    });

  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    document.getElementById("orders-list").innerHTML = "<p class='text-danger'>No se pudieron cargar tus pedidos.</p>";
  }
}

// Función auxiliar para mostrar/ocultar productos
function toggleProductos(pedidoId) {
  const div = document.getElementById(`productos-${pedidoId}`);
  if (div) {
    div.classList.toggle('d-none');
  }
};

window.toggleProductos = toggleProductos;
window.mostrarEditor = mostrarEditor;
window.guardarCambios = guardarCambios;
window.eliminarProducto = eliminarProducto;
window.configurarMetodoEnvio = configurarMetodoEnvio;



