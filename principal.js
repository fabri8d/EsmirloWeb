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

document.addEventListener('DOMContentLoaded', () => {
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
