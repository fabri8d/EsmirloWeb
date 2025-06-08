export async function cantidadCarrito() {
  const token = localStorage.getItem('token');
  if (!token) return 0;

  try {
    const res = await fetch('http://localhost:3000/cart/getItemCount', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      console.error('Error en respuesta:', res.status);
      return 0;
    }
    const data = await res.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error al obtener la cantidad del carrito:', error);
    return 0;
  }
}

export async function contadorCarrito() {
  const contadorElemento = document.getElementById('cart-count');
  if (contadorElemento) {
    const count = await cantidadCarrito();
    contadorElemento.textContent = count;
  }
}


