import { checkSession, logout } from "../utils/sessions.js";
const token = localStorage.getItem("token");

let pagina = 1;
const limite = 5;

document.addEventListener("DOMContentLoaded", () => {
  if (!checkSession()) return;

  aplicarFiltros(1)

  // Eventos filtros
  document.getElementById("filtro-fecha").addEventListener("change", () => aplicarFiltros(1));
  document.getElementById("filtro-estado").addEventListener("change", () => aplicarFiltros(1));
  document.getElementById("filtro-usuario").addEventListener("change", () => aplicarFiltros(1));

  // Eventos paginación
  document.getElementById("btnAnterior").addEventListener("click", () => {
    if (pagina > 1) aplicarFiltros(pagina - 1);
  });

  document.getElementById("btnSiguiente").addEventListener("click", () => {
    aplicarFiltros(pagina + 1);
  });
});


function mostrarPedidos(pedidos) {
  const contenedor = document.getElementById("orders-list");
  contenedor.innerHTML = "";

  if (!pedidos || !pedidos.length) {
    contenedor.innerHTML = `<p>No se encontraron pedidos.</p>`;
    return;
  }

  pedidos.forEach((pedido) => {
    const fecha = new Date(pedido.createdAt).toLocaleDateString("es-ES");
    const metodo = pedido.deliveryMethod === "home_delivery" ? "A domicilio" : "Retiro en tienda";

    let estadoTraducido = {
      "cancelled": "Cancelado",
      "completed": "Entregado",
      "pending": "Pendiente",
      "paid": "Pago realizado",
      "shipped": "Enviado"
    }[pedido.status] || pedido.status;

    const divPedido = document.createElement("div");
    divPedido.classList.add("card", "mb-3", "p-3", "shadow-sm");

    divPedido.innerHTML = `
      <h5>Pedido #${pedido.id}</h5>
      <p><strong>Cliente:</strong> ${pedido.user.firstName} ${pedido.user.lastName}</p>
      <p><strong>Email:</strong> ${pedido.user.email}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Método de envío:</strong> ${metodo}</p>
      <p><strong>Total:</strong> $${pedido.totalAmount}</p>
      <p><strong>Estado:</strong> ${estadoTraducido}</p>
      <p>
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
          ${pedido.items?.map(item => `
            <li class="list-group-item">
              <strong>${item.productName}</strong> - 
              Color: ${item.variantColor}, 
              Talla: ${item.variantSize}, 
              Cantidad: ${item.variantQuantity}
            </li>`).join("")}
        </ul>
      </div>
    `;

    contenedor.appendChild(divPedido);
  });
}

function toggleProductos(pedidoId) {
  const div = document.getElementById(`productos-${pedidoId}`);
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

async function aplicarFiltros(nuevaPagina = 1) {
  pagina = nuevaPagina;

  const fechaSeleccionada = document.getElementById("filtro-fecha").value;
  const estadoSeleccionado = document.getElementById("filtro-estado").value;
  const usuarioSeleccionado = document.getElementById("filtro-usuario").value;

  const queryParams = new URLSearchParams();
  if (fechaSeleccionada) {
    queryParams.append("startDate", fechaSeleccionada);
    queryParams.append("endDate", fechaSeleccionada);
  }
  if (estadoSeleccionado) queryParams.append("status", estadoSeleccionado);
  if (usuarioSeleccionado) queryParams.append("username", usuarioSeleccionado);

  queryParams.append("page", pagina);
  queryParams.append("limit", limite);

  try {
    const res = await fetch(`http://localhost:3000/orders/getOrdersFiltered?${queryParams.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const orders = Array.isArray(data) ? data : data.orders;
    const total = data.total ?? (Array.isArray(data) ? data.length : 0);

    mostrarPedidos(orders);
    actualizarPaginacion(total);
  } catch (error) {
    console.error("Error al aplicar filtros:", error);
  }
}

function actualizarPaginacion(total) {
  const totalPaginas = Math.ceil(total / limite);
  document.getElementById("paginaActual").textContent = `Página ${pagina} de ${totalPaginas}`;

  document.getElementById("btnAnterior").disabled = pagina <= 1;
  document.getElementById("btnSiguiente").disabled = pagina >= totalPaginas;
}

window.aplicarFiltros = aplicarFiltros;
window.toggleProductos = toggleProductos;
window.actualizarEstadoPedido = actualizarEstadoPedido;
window.logout = logout;
