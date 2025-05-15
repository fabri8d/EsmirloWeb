// Actualiza el contador del carrito en la navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('carrito')) || []; // Obtiene el carrito desde localStorage
    const count = cart.reduce((acc, item) => acc + item.cantidad, 0); // Suma todas las cantidades
    document.getElementById('cart-count').textContent = count; // Muestra la cantidad total en el ícono del carrito
}


// Agrega un producto al carrito
function addToCart(nombre, precio, talle) {
    let cart = JSON.parse(localStorage.getItem('carrito')) || []; // Obtiene el carrito, o crea uno nuevo si no existe

    // Verifica si ya existe ese producto con el mismo talle
    const existingIndex = cart.findIndex(item => item.nombre === nombre && item.talle === talle);

    if (existingIndex > -1) {
        cart[existingIndex].cantidad++; // Si ya existe, simplemente aumenta la cantidad
    } else {
        // Si no existe, lo agrega como nuevo producto
        cart.push({ nombre: nombre, precio: precio, talle: talle, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(cart)); // Guarda el carrito actualizado en localStorage
    updateCartCount(); // Actualiza el contador visual del carrito
}

// Detecta los clics en todos los botones "Agregar al carrito"
document.querySelectorAll('.btn.btn-primary').forEach((btn, index) => {
    btn.addEventListener('click', function () {
        const card = this.closest('.card'); // Obtiene la tarjeta del producto
        const nombre = card.querySelector('.card-title').textContent; // Obtiene el nombre del producto
        const precioTexto = card.querySelector('.card-text').textContent.replace('$', ''); // Obtiene el precio como texto y remueve el símbolo $
        const precio = parseFloat(precioTexto); 
        const talle = card.querySelector('select').value; // Obtiene el talle seleccionado del select

        addToCart(nombre, precio, talle); // Agrega el producto al carrito
    });
});

updateCartCount(); // Actualiza el contador al cargar la página


updateCartCount();

