const params = new URLSearchParams(window.location.search);
const id = params.get("id");
let productoActual = null;

document.addEventListener("DOMContentLoaded", async () => {
  if (!id) {
    document.getElementById("detalle-producto").innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/products/getProductById/${id}`);
    const producto = await res.json();
    productoActual = producto;

    document.getElementById("detalle-producto").innerHTML = `
      <div class="card mb-3">
        <img src="${producto.imageUrl}" class="card-img-top" alt="${producto.name}" />
        <div class="card-body">
          <h5 class="card-title">${producto.name}</h5>
          <p class="card-text">${producto.description}</p>
          <p class="card-text"><strong>Precio:</strong> $${producto.price}</p>
          <button class="btn btn-primary" id="btn-agregar">Agregar al carrito</button>
        </div>
      </div>
    `;

    document.getElementById("btn-agregar").addEventListener("click", () => agregarAlCarrito(productoActual));
  } catch (error) {
    console.error("Error al cargar el producto", error);
    document.getElementById("detalle-producto").innerHTML = "<p>Error al cargar el producto.</p>";
  }
});

function agregarAlCarrito(producto) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert("Producto añadido al carrito");
}

