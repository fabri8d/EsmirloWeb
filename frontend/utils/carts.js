export function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('carrito')) || [];
    const count = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const contadorElemento = document.getElementById('cart-count');
    if (contadorElemento) {
        contadorElemento.textContent = count;
    }
}