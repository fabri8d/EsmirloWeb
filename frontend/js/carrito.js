const token = localStorage.getItem("token");

document.addEventListener('DOMContentLoaded', () => {
  cargarCarrito();
  configurarMetodoEnvio();
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

    const metodoEntrega = document.getElementById('metodo-envio').value;
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

    const payload = {
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
      body: JSON.stringify( payload ),
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

// function configurarEventos() {
//   document.getElementById('confirmar-compra').addEventListener('click', confirmarCompra);

//   document.getElementById('metodo-envio').addEventListener('change', function () {
//     const mostrar = this.value === "Envío a domicilio";
//     ['campo-direccion', 'campo-provincia', 'campo-codigo-postal'].forEach(id => {
//       document.getElementById(id).classList.toggle('d-none', !mostrar);
//     });
//   });

//   document.getElementById('codigo-postal')?.addEventListener('input', actualizarTotales);
// }

// async function confirmarCompra() {
//   try {
//     const res = await fetch('http://localhost:3000/cart/getCart', {
//       headers: { 'Authorization': `Bearer ${token}` }
//     });

//     const carrito = await res.json();
//     const items = carrito.items || [];
//     if (items.length === 0) {
//       alert("Tu carrito está vacío.");
//       return;
//     }

//     const metodoEntrega = document.getElementById('metodo-envio').value;
//     const email = document.getElementById('email').value;
//     const direccion = document.getElementById('direccion').value;
//     const provincia = document.getElementById('provincia').value;
//     const cp = document.getElementById('codigo-postal').value;
//     const costoEnvio = metodoEntrega === "Envío a domicilio" ? calcularCostoEnvio(cp) : 0;
//     const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     const totalFinal = total + costoEnvio;

//     if (!email || (metodoEntrega === "Envío a domicilio" && (!direccion || !provincia || !cp))) {
//       alert("Por favor, completa todos los campos.");
//       return;
//     }

//     // Aquí podrías hacer un fetch para confirmar la compra (POST /checkout)
//     alert(`Compra confirmada. Total: $${totalFinal.toFixed(2)}. Detalles enviados a ${email}.`);
//     cargarCarrito();
//   } catch (err) {
//     console.error("Error al confirmar compra:", err);
//   }
// }

// function calcularCostoEnvio(cp) {
//   return cp && cp.trim() !== "" ? 800 : 0;
// }
























// document.addEventListener('DOMContentLoaded', () => {
//   cargarCarrito();
//   actualizarContadorCarrito();
//   configurarEventos();
// });

// function cargarCarrito() {
//   const items = JSON.parse(localStorage.getItem('carrito')) || [];
//   const cartItemsDiv = document.getElementById('cart-items');
//   const totalSpan = document.getElementById('cart-total');
//   cartItemsDiv.innerHTML = '';
//   let total = 0;

//   items.forEach((item, index) => {
//     const subtotal = item.precio * item.cantidad;
//     total += subtotal;

//     const itemHTML = `
//       <div class="col-12 card p-3 shadow-sm" id="item-${index}">
//         <div class="d-flex justify-content-between align-items-center">
//           <div>
//             <h5>${item.nombre}</h5>
//             <p class="mb-1">Precio: $${item.precio.toFixed(2)}</p>
//             <p class="mb-1" id="talle-display-${index}">Talle: <strong>${item.talle}</strong></p>
//             <p class="mb-1" id="cantidad-display-${index}">Cantidad: <strong>${item.cantidad}</strong></p>

//             <div id="talle-editor-${index}" class="mb-2 d-none">
//               <label class="form-label mb-1">Nuevo talle:</label>
//               <select class="form-select form-select-sm w-50 d-inline-block me-2" id="nuevo-talle-${index}">
//                 ${['S', 'M', 'L', 'XL', 'XXL'].map(t => `<option value="${t}" ${item.talle === t ? 'selected' : ''}>${t}</option>`).join('')}
//               </select>
//             </div>

//             <div id="cantidad-editor-${index}" class="mb-2 d-none">
//               <label class="form-label mb-1">Nueva cantidad:</label>
//               <input type="number" min="1" class="form-control form-control-sm w-50" id="nueva-cantidad-${index}" value="${item.cantidad}">
//             </div>
//           </div>
//           <div class="text-end">
//             <p class="mb-1 fw-bold">Subtotal: $${subtotal.toFixed(2)}</p>
//             <button class="btn btn-sm btn-warning mb-1" onclick="editarProducto(${index})">
//               <i class="bi bi-pencil"></i> Editar
//             </button><br>
//             <button class="btn btn-sm btn-success mb-1 d-none" id="guardar-${index}" onclick="guardarEdiciones(${index})">
//               Guardar
//             </button><br>
//             <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${index})">
//               <i class="bi bi-trash"></i> Eliminar
//             </button>
//           </div>
//         </div>
//       </div>
//     `;
//     cartItemsDiv.innerHTML += itemHTML;
//   });

//   totalSpan.textContent = total.toFixed(2);
//   actualizarTotales();
//   actualizarContadorCarrito();

//   if (items.length > 0) {
//     document.getElementById('carrito-compra').classList.remove('d-none');
//     document.getElementById('resumen-compra').classList.add('d-none');
//   }
// }

// function actualizarContadorCarrito() {
//   const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
//   const contador = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
//   const badge = document.getElementById('cart-count');
//   if (badge) {
//     badge.textContent = contador;
//   }
// }

// function editarProducto(index) {
//   document.getElementById(`talle-display-${index}`).classList.add('d-none');
//   document.getElementById(`cantidad-display-${index}`).classList.add('d-none');
//   document.getElementById(`talle-editor-${index}`).classList.remove('d-none');
//   document.getElementById(`cantidad-editor-${index}`).classList.remove('d-none');
//   document.getElementById(`guardar-${index}`).classList.remove('d-none');
//   document.querySelector(`#item-${index} .btn-warning`).classList.add('d-none');
// }

// function guardarEdiciones(index) {
//   let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
//   const nuevoTalle = document.getElementById(`nuevo-talle-${index}`).value;
//   const nuevaCantidad = parseInt(document.getElementById(`nueva-cantidad-${index}`).value);

//   carrito[index].talle = nuevoTalle;
//   carrito[index].cantidad = nuevaCantidad;

//   localStorage.setItem('carrito', JSON.stringify(carrito));
//   cargarCarrito();
// }

// function eliminarProducto(index) {
//   let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
//   carrito.splice(index, 1);
//   localStorage.setItem('carrito', JSON.stringify(carrito));
//   cargarCarrito();
// }

// function actualizarTotales() {
//   const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
//   const metodo = document.getElementById('metodo-envio')?.value;
//   const cp = document.getElementById('codigo-postal')?.value;
//   let totalProductos = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
//   let costoEnvio = (metodo === "Envío a domicilio") ? calcularCostoEnvio(cp) : 0;
//   let totalFinal = totalProductos + costoEnvio;

//   document.getElementById('costo-envio').textContent = `Costo de envío: $${costoEnvio.toFixed(2)}`;
//   document.getElementById('total-final').textContent = `Total final: $${totalFinal.toFixed(2)}`;
//   return { costoEnvio, totalFinal };
// }

// function calcularCostoEnvio(cp) {
//   return cp && cp.trim() !== "" ? 800 : 0;
// }

// function confirmarCompra() {
//   const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
//   if (carrito.length === 0) {
//     alert("Tu carrito está vacío.");
//     return;
//   }

//   const metodoEntrega = document.getElementById('metodo-envio').value;
//   const codigoPostal = document.getElementById('codigo-postal').value;
//   const direccion = document.getElementById('direccion').value;
//   const provincia = document.getElementById('provincia').value;
//   const { costoEnvio, totalFinal } = actualizarTotales();
//   const email = document.getElementById('email').value;

//   if (!email) {
//     alert("El correo es obligatorio.");
//     return;
//   }

//   if (metodoEntrega === "Envío a domicilio" && (!codigoPostal || !direccion || !provincia)) {
//     alert("Por favor, completa todos los campos para el envío.");
//     return;
//   }

//   const codigoEnvio = Math.random().toString(36).substring(2, 10).toUpperCase();
//   const mensaje = `
//     Detalles de tu compra:
//     Productos: ${carrito.map(item => `${item.nombre} - Cantidad: ${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`).join('\n')}
//     Costo de Envío: $${costoEnvio.toFixed(2)}
//     Total Final: $${totalFinal.toFixed(2)}
//     Código de Envío: ${codigoEnvio}
//     Estimación de entrega: ${metodoEntrega === "Envío a domicilio" ? "3-5 días hábiles" : "Inmediato"}
//   `;

//   alert(`Se ha enviado un correo con los detalles de tu compra a ${email}.`);
//   console.log(mensaje);

//   localStorage.removeItem('carrito');
//   alert("¡Compra confirmada!");
//   cargarCarrito();
//   document.getElementById('carrito-compra').classList.add('d-none');
//   document.getElementById('resumen-compra').classList.remove('d-none');
// }

// function configurarEventos() {
//   document.getElementById('confirmar-compra').addEventListener('click', confirmarCompra);

//   document.getElementById('metodo-envio').addEventListener('change', function () {
//     const campoDireccion = document.getElementById('campo-direccion');
//     const campoProvincia = document.getElementById('campo-provincia');
//     const campoCP = document.getElementById('campo-codigo-postal');

//     if (this.value === "Envío a domicilio") {
//       campoDireccion.classList.remove('d-none');
//       campoProvincia.classList.remove('d-none');
//       campoCP.classList.remove('d-none');
//     } else {
//       campoDireccion.classList.add('d-none');
//       campoProvincia.classList.add('d-none');
//       campoCP.classList.add('d-none');
//     }

//     actualizarTotales();
//   });

//   document.getElementById('codigo-postal').addEventListener('input', actualizarTotales);
// }
