document.addEventListener('DOMContentLoaded', () => {
  cargarCarrito();
  actualizarContadorCarrito();
  configurarEventos();
});

function cargarCarrito() {
  const items = JSON.parse(localStorage.getItem('carrito')) || [];
  const cartItemsDiv = document.getElementById('cart-items');
  const totalSpan = document.getElementById('cart-total');
  cartItemsDiv.innerHTML = '';
  let total = 0;

  items.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const itemHTML = `
      <div class="col-12 card p-3 shadow-sm" id="item-${index}">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5>${item.nombre}</h5>
            <p class="mb-1">Precio: $${item.precio.toFixed(2)}</p>
            <p class="mb-1" id="talle-display-${index}">Talle: <strong>${item.talle}</strong></p>
            <p class="mb-1" id="cantidad-display-${index}">Cantidad: <strong>${item.cantidad}</strong></p>

            <div id="talle-editor-${index}" class="mb-2 d-none">
              <label class="form-label mb-1">Nuevo talle:</label>
              <select class="form-select form-select-sm w-50 d-inline-block me-2" id="nuevo-talle-${index}">
                ${['S', 'M', 'L', 'XL', 'XXL'].map(t => `<option value="${t}" ${item.talle === t ? 'selected' : ''}>${t}</option>`).join('')}
              </select>
            </div>

            <div id="cantidad-editor-${index}" class="mb-2 d-none">
              <label class="form-label mb-1">Nueva cantidad:</label>
              <input type="number" min="1" class="form-control form-control-sm w-50" id="nueva-cantidad-${index}" value="${item.cantidad}">
            </div>
          </div>
          <div class="text-end">
            <p class="mb-1 fw-bold">Subtotal: $${subtotal.toFixed(2)}</p>
            <button class="btn btn-sm btn-warning mb-1" onclick="editarProducto(${index})">
              <i class="bi bi-pencil"></i> Editar
            </button><br>
            <button class="btn btn-sm btn-success mb-1 d-none" id="guardar-${index}" onclick="guardarEdiciones(${index})">
              Guardar
            </button><br>
            <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${index})">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
    cartItemsDiv.innerHTML += itemHTML;
  });

  totalSpan.textContent = total.toFixed(2);
  actualizarTotales();
  actualizarContadorCarrito();

  if (items.length > 0) {
    document.getElementById('carrito-compra').classList.remove('d-none');
    document.getElementById('resumen-compra').classList.add('d-none');
  }
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const contador = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = contador;
  }
}

function editarProducto(index) {
  document.getElementById(`talle-display-${index}`).classList.add('d-none');
  document.getElementById(`cantidad-display-${index}`).classList.add('d-none');
  document.getElementById(`talle-editor-${index}`).classList.remove('d-none');
  document.getElementById(`cantidad-editor-${index}`).classList.remove('d-none');
  document.getElementById(`guardar-${index}`).classList.remove('d-none');
  document.querySelector(`#item-${index} .btn-warning`).classList.add('d-none');
}

function guardarEdiciones(index) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const nuevoTalle = document.getElementById(`nuevo-talle-${index}`).value;
  const nuevaCantidad = parseInt(document.getElementById(`nueva-cantidad-${index}`).value);

  carrito[index].talle = nuevoTalle;
  carrito[index].cantidad = nuevaCantidad;

  localStorage.setItem('carrito', JSON.stringify(carrito));
  cargarCarrito();
}

function eliminarProducto(index) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  cargarCarrito();
}

function actualizarTotales() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const metodo = document.getElementById('metodo-envio')?.value;
  const cp = document.getElementById('codigo-postal')?.value;
  let totalProductos = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
  let costoEnvio = (metodo === "Envío a domicilio") ? calcularCostoEnvio(cp) : 0;
  let totalFinal = totalProductos + costoEnvio;

  document.getElementById('costo-envio').textContent = `Costo de envío: $${costoEnvio.toFixed(2)}`;
  document.getElementById('total-final').textContent = `Total final: $${totalFinal.toFixed(2)}`;
  return { costoEnvio, totalFinal };
}

function calcularCostoEnvio(cp) {
  return cp && cp.trim() !== "" ? 800 : 0;
}

function confirmarCompra() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const metodoEntrega = document.getElementById('metodo-envio').value;
  const codigoPostal = document.getElementById('codigo-postal').value;
  const direccion = document.getElementById('direccion').value;
  const provincia = document.getElementById('provincia').value;
  const { costoEnvio, totalFinal } = actualizarTotales();
  const email = document.getElementById('email').value;

  if (!email) {
    alert("El correo es obligatorio.");
    return;
  }

  if (metodoEntrega === "Envío a domicilio" && (!codigoPostal || !direccion || !provincia)) {
    alert("Por favor, completa todos los campos para el envío.");
    return;
  }

  const codigoEnvio = Math.random().toString(36).substring(2, 10).toUpperCase();
  const mensaje = `
    Detalles de tu compra:
    Productos: ${carrito.map(item => `${item.nombre} - Cantidad: ${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`).join('\n')}
    Costo de Envío: $${costoEnvio.toFixed(2)}
    Total Final: $${totalFinal.toFixed(2)}
    Código de Envío: ${codigoEnvio}
    Estimación de entrega: ${metodoEntrega === "Envío a domicilio" ? "3-5 días hábiles" : "Inmediato"}
  `;

  alert(`Se ha enviado un correo con los detalles de tu compra a ${email}.`);
  console.log(mensaje);

  localStorage.removeItem('carrito');
  alert("¡Compra confirmada!");
  cargarCarrito();
  document.getElementById('carrito-compra').classList.add('d-none');
  document.getElementById('resumen-compra').classList.remove('d-none');
}

function configurarEventos() {
  document.getElementById('confirmar-compra').addEventListener('click', confirmarCompra);

  document.getElementById('metodo-envio').addEventListener('change', function () {
    const campoDireccion = document.getElementById('campo-direccion');
    const campoProvincia = document.getElementById('campo-provincia');
    const campoCP = document.getElementById('campo-codigo-postal');

    if (this.value === "Envío a domicilio") {
      campoDireccion.classList.remove('d-none');
      campoProvincia.classList.remove('d-none');
      campoCP.classList.remove('d-none');
    } else {
      campoDireccion.classList.add('d-none');
      campoProvincia.classList.add('d-none');
      campoCP.classList.add('d-none');
    }

    actualizarTotales();
  });

  document.getElementById('codigo-postal').addEventListener('input', actualizarTotales);
}
