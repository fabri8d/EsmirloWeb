const token = localStorage.getItem("token"); // Asegurate de tenerlo cargado

document.addEventListener('DOMContentLoaded', async () => {
  await cargarProductos();
  await cargarCarrito();
});

let productos = [];

async function cargarProductos() {
  try {
    const res = await fetch("http://localhost:3000/products/getProducts", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    productos = await res.json();

    const productoSelect = document.getElementById('producto-select');
    productoSelect.innerHTML = productos.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    productoSelect.addEventListener('change', actualizarVariantes);

    actualizarVariantes(); // para el primero por defecto
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function actualizarVariantes() {
  const productoId = parseInt(document.getElementById('producto-select').value);
  const producto = productos.find(p => p.id === productoId);
  const variantes = producto.variants;

  const varianteSelect = document.getElementById('variante-select');
  varianteSelect.innerHTML = variantes.map(v => `
    <option value="${v.id}">${v.size} / ${v.color} (Stock: ${v.stock})</option>
  `).join('');
}

async function agregarAlCarrito() {
  const variantId = parseInt(document.getElementById('variante-select').value);
  const quantity = parseInt(document.getElementById('cantidad').value);

  try {
    const res = await fetch('http://localhost:3000/cart/addProductToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productVariantId: variantId, quantity })
    });

    if (!res.ok) throw new Error("Error al agregar al carrito");
    await cargarCarrito();
  } catch (error) {
    console.error(error);
  }
}

async function cargarCarrito() {
  try {
    const res = await fetch('http://localhost:3000/cart/getCart', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const carrito = await res.json();
    const items = carrito.items || [];

    const cartItemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');

    cartItemsDiv.innerHTML = '';
    let total = 0;

    items.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      const div = document.createElement('div');
      div.classList.add('mb-2');
      div.innerHTML = `
        <strong>${item.productVariant.product.name}</strong><br>
        Talle: ${item.productVariant.size}, Color: ${item.productVariant.color}<br>
        Cantidad: ${item.quantity} - Subtotal: $${subtotal.toFixed(2)}
      `;
      cartItemsDiv.appendChild(div);
    });

    totalSpan.textContent = total.toFixed(2);
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
  }
}
