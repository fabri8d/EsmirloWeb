import { checkSession, logout } from "../utils/sessions.js";
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  if (!checkSession()) return;
  cargarPedidosUsuario();
});

async function cargarPedidosUsuario() {
  const contenedor = document.getElementById("orders-list");
  contenedor.innerHTML = "";

  try {
    const res = await fetch(`http://localhost:3000/orders/getOrders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const pedidos = await res.json();

    if (!pedidos.length) {
      contenedor.innerHTML = `<p>No hay pedidos registrados.</p>`;
      return;
    }

    pedidos.forEach((pedido) => {
      const fecha = new Date(pedido.createdAt).toLocaleDateString();
      const total = pedido.totalAmount;
      const metodo = pedido.deliveryMethod === "home_delivery" ? "A domicilio" : "Retiro en tienda";

      let estadoTraducido = pedido.status;
      if (estadoTraducido === "cancelled") estadoTraducido = "Cancelado";
      else if (estadoTraducido === "completed") estadoTraducido = "Entregado";
      else if (estadoTraducido === "pending") estadoTraducido = "Pendiente";
      else if (estadoTraducido === "paid") estadoTraducido = "Pago realizado";
      else if (estadoTraducido === "shipped") estadoTraducido = "Enviado";

      const divPedido = document.createElement("div");
      divPedido.classList.add("card", "mb-3", "p-3", "shadow-sm");

      divPedido.innerHTML = `
        <h5>Pedido #${pedido.id}</h5>
        <p><strong>Cliente:</strong> ${pedido.user.firstName} ${pedido.user.lastName}</p>
        <p><strong>Email:</strong> ${pedido.user.email}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Método de envío:</strong> ${metodo}</p>
        <p><strong>Total:</strong> $${total}</p>
        <p><strong>Estado:</strong> ${estadoTraducido}</p>
        <p><strong>Estado:</strong> 
            <select id="select-estado-${pedido.id}" class="form-select d-inline-block w-auto ms-2 me-2">
                <option value="pending" ${pedido.status === "pending" ? "selected" : ""}>Pendiente</option>
                <option value="paid" ${pedido.status === "paid" ? "selected" : ""}>Pago realizado</option>
                <option value="shipped" ${pedido.status === "shipped" ? "selected" : ""}>Enviado</option>
                <option value="completed" ${pedido.status === "completed" ? "selected" : ""}>Entregado</option>
                <option value="cancelled" ${pedido.status === "cancelled" ? "selected" : ""}>Cancelado</option>
            </select>
            <button class="btn btn-sm btn-primary" onclick="actualizarEstadoPedido(${pedido.id})">Cambiar estado</button>
        </p>

        <button class="btn btn-sm btn-info me-2 mb-2" onclick="toggleProductos(${pedido.id})">Ver productos</button>
        <div id="productos-${pedido.id}" style="display: none;">
          <h6>Productos:</h6>
          <ul class="list-group mb-2">
            ${pedido.items?.map((item) => `
              <li class="list-group-item">
                <strong>${item.productName}</strong> - 
                Color: ${item.variantColor}, 
                Talla: ${item.variantSize}, 
                Cantidad: ${item.variantQuantity}
              </li>
            `).join("")}
          </ul>
        </div>

        
      `;

      contenedor.appendChild(divPedido);
    });

  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    contenedor.innerHTML = "<p class='text-danger'>No se pudieron cargar tus pedidos.</p>";
  }
}

function toggleProductos(pedidoId) {
  const div = document.getElementById(`productos-${pedidoId}`);
  div.style.display = div.style.display === "none" ? "block" : "none";
}

function toggleCambioEstado(pedidoId) {
  const div = document.getElementById(`estado-${pedidoId}`);
  div.style.display = div.style.display === "none" ? "block" : "none";
}

async function actualizarEstadoPedido(pedidoId) {
  const nuevoEstado = document.getElementById(`select-estado-${pedidoId}`).value;

  try {
    const res = await fetch(`http://localhost:3000/orders/updateOrderStatus/${pedidoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: nuevoEstado }),
    });

    if (!res.ok) throw new Error();

    alert("Estado actualizado correctamente.");
    location.reload();
  } catch (err) {
    alert("Error al actualizar el estado del pedido.");
  }
}

window.toggleProductos = toggleProductos;
window.toggleCambioEstado = toggleCambioEstado;
window.actualizarEstadoPedido = actualizarEstadoPedido;
window.logout = logout;
function mostrarPedidos(pedidos) {
  const contenedor = document.getElementById("orders-list");
  contenedor.innerHTML = "";

  if (!pedidos.length) {
    contenedor.innerHTML = `<p>No se encontraron pedidos para la fecha seleccionada.</p>`;
    return;
  }

  pedidos.forEach((pedido) => {
    const fecha = new Date(pedido.createdAt).toLocaleDateString("es-ES");
    const total = pedido.totalAmount;
    const metodo = pedido.deliveryMethod === "home_delivery" ? "A domicilio" : "Retiro en tienda";

    let estadoTraducido = pedido.status;
    if (estadoTraducido === "cancelled") estadoTraducido = "Cancelado";
    else if (estadoTraducido === "completed") estadoTraducido = "Entregado";
    else if (estadoTraducido === "pending") estadoTraducido = "Pendiente";
    else if (estadoTraducido === "paid") estadoTraducido = "Pago realizado";
    else if (estadoTraducido === "shipped") estadoTraducido = "Enviado";

    const divPedido = document.createElement("div");
    divPedido.classList.add("card", "mb-3", "p-3", "shadow-sm");

    divPedido.innerHTML = `
      <h5>Pedido #${pedido.id}</h5>
      <p><strong>Cliente:</strong> ${pedido.user.firstName} ${pedido.user.lastName}</p>
      <p><strong>Email:</strong> ${pedido.user.email}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Método de envío:</strong> ${metodo}</p>
      <p><strong>Total:</strong> $${total}</p>
      <p><strong>Estado:</strong> ${estadoTraducido}</p>
      <p><strong>Estado:</strong> 
          <select id="select-estado-${pedido.id}" class="form-select d-inline-block w-auto ms-2 me-2">
              <option value="pending" ${pedido.status === "pending" ? "selected" : ""}>Pendiente</option>
              <option value="paid" ${pedido.status === "paid" ? "selected" : ""}>Pago realizado</option>
              <option value="shipped" ${pedido.status === "shipped" ? "selected" : ""}>Enviado</option>
              <option value="completed" ${pedido.status === "completed" ? "selected" : ""}>Entregado</option>
              <option value="cancelled" ${pedido.status === "cancelled" ? "selected" : ""}>Cancelado</option>
          </select>
          <button class="btn btn-sm btn-primary" onclick="actualizarEstadoPedido(${pedido.id})">Cambiar estado</button>
      </p>

      <button class="btn btn-sm btn-info me-2 mb-2" onclick="toggleProductos(${pedido.id})">Ver productos</button>
      <div id="productos-${pedido.id}" style="display: none;">
        <h6>Productos:</h6>
        <ul class="list-group mb-2">
          ${pedido.items?.map((item) => `
            <li class="list-group-item">
              <strong>${item.productName}</strong> - 
              Color: ${item.variantColor}, 
              Talla: ${item.variantSize}, 
              Cantidad: ${item.variantQuantity}
            </li>
          `).join("")}
        </ul>
      </div>
    `;

    contenedor.appendChild(divPedido);
  });
}
async function filtrarPedidosPorFecha() {
  const fechaSeleccionada = document.getElementById("filtro-fecha").value;
  if (!fechaSeleccionada) return;

  try {
    const res = await fetch(`http://localhost:3000/orders/getOrders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const pedidos = await res.json();

    // Formatear fecha seleccionada a formato local
    const pedidosFiltrados = pedidos.filter((pedido) => {
      const fechaPedido = new Date(pedido.createdAt).toISOString().split("T")[0];
      return fechaPedido === fechaSeleccionada;
    });

    mostrarPedidos(pedidosFiltrados);
  } catch (error) {
    console.error("Error al filtrar pedidos:", error);
  }
}

