const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
document.addEventListener('DOMContentLoaded', () => {
    loadCategories()
    cargarProductos()
    updateCartCount();

    // Detecta clics en botones para agregar al carrito
    document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();

            const card = btn.closest('.card');
            const nombre = card.querySelector('.card-title').textContent;
            const precioTexto = card.querySelector('.card-text').textContent.replace('$', '').trim();
            const precio = parseFloat(precioTexto);

            // Si hay talle, lo toma; si no, usa 'Único'
            const talleSelect = card.querySelector('select.talle-select');
            const talle = talleSelect ? talleSelect.value : 'Único';

            addToCart(nombre, precio, talle);
        });
    });
});


// Función para actualizar el contador en la navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('carrito')) || [];
    const count = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const contadorElemento = document.getElementById('cart-count');
    if (contadorElemento) {
        contadorElemento.textContent = count;
    }
}

// Función para agregar producto al carrito
function addToCart(nombre, precio, talle) {
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];

    const existingIndex = cart.findIndex(item => item.nombre === nombre && item.talle === talle);

    if (existingIndex > -1) {
        cart[existingIndex].cantidad++;
    } else {
        cart.push({ nombre, precio, talle, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(cart));
    updateCartCount();
}


async function cargarProductos() {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("nombre");
    
    if (!categoria) {
      document.getElementById("titulo-categoria").textContent = "Categoría no especificada";
      return;  // Salir para no hacer fetch con categoría indefinida
    }
    
    document.getElementById("titulo-categoria").textContent = `Categoría: ${categoria}`;

    
    try {
        const res = await fetch(`http://localhost:3000/products/getProductsByCategory/${encodeURIComponent(categoria)}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        );
        const productos = await res.json();

        const contenedor = document.getElementById("productos-contenedor");
        contenedor.innerHTML = "";

        productos.forEach(p => {
            const col = document.createElement("div");
            col.className = "col";
            col.innerHTML = `
            <div class="card h-100">
              <img src="${p.imageUrl}" class="card-img-top" alt="${p.name}" />
              <div class="card-body text-center">
                <h5 class="card-title">${p.name}</h5>
                <p class="card-text text-success fw-bold">$${p.price}</p>
                <a href="#" class="btn btn-primary btn-sm btn-agregar-carrito">Agregar al carrito</a>
              </div>
            </div>
          `;
            contenedor.appendChild(col);
        });

    } catch (err) {
        console.error("Error al cargar productos:", err.message);
    }
}

async function loadCategories() {
    
    try {
        const res = await fetch("http://localhost:3000/categories/getCategories", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const categories = await res.json();

        const dropdown = document.getElementById("categorias-dropdown");
        dropdown.innerHTML = "";

        categories.forEach(cat => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.className = "dropdown-item";
            a.href = `categoria.html?nombre=${encodeURIComponent(cat.name)}`; // O ajusta si usas otra ruta
            a.textContent = cat.name;
            li.appendChild(a);
            dropdown.appendChild(li);
        });

    } catch (err) {
        console.error("Error al cargar categorías:", err.message);
    }
}


