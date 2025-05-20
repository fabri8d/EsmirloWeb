// Mostrar u ocultar categorías
function showCategory(categoryId) {
    const categories = document.querySelectorAll('.category');
    categories.forEach(cat => cat.style.display = 'none');

    const selected = document.getElementById(categoryId);
    if (selected) {
        selected.style.display = 'block';
    }
}

// Lógica para cargar productos desde backend
async function cargarProductos() {
    try {
        const response = await fetch('/productos');
        if (!response.ok) throw new Error('Error al cargar productos');

        const productos = await response.json();

        // Limpiar todas las tablas
        ['camisetas', 'conjuntos', 'accesorios'].forEach(cat => {
        const tbody = document.querySelector(`#${cat} tbody`); 
            if (tbody) tbody.innerHTML = '';
        });

        // Agregar productos a la tabla según su categoría
        productos.forEach(prod => {
            const tbody = document.querySelector(`#${prod.categoria} tbody`); // ✅ Correcto
            if (!tbody) return; // Ignorar si no existe la categoría

            const tr = document.createElement('tr');
            tr.innerHTML = `
    <th>${prod.id_producto}</th>
    <td>${prod.nombre}</td>
    <td>${prod.precio}</td>
    <td>${prod.cantidad}</td>
    <td>
        <button class="btn btn-warning btn-sm" onclick="editarProducto(${prod.id_producto})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${prod.id_producto})">Eliminar</button>
    </td>
`;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
    }
}

// Capturar formulario y agregar producto
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar la categoría camisetas al cargar la página
    showCategory('camisetas');

    // Cargar productos desde backend
    cargarProductos();

    // Botón para agregar producto en el modal
    const btnAgregar = document.querySelector('#addProductModal .btn-primary');
    btnAgregar.addEventListener('click', async () => {
        const nombre = document.getElementById('productName').value.trim();
        const precio = parseFloat(document.getElementById('productPrice').value);
        const cantidad = parseInt(document.getElementById('productStock').value);
        const categoria = document.getElementById('productCategory').value;
        
        // Obtén descripción, que debes agregar en el modal (ver nota abajo)
        const descripcionInput = document.getElementById('productDescription');
        const descripcion = descripcionInput ? descripcionInput.value.trim() : '';

        if (!nombre || !descripcion || isNaN(precio) || isNaN(cantidad) || !categoria) {
            alert('Por favor completa todos los campos correctamente.');
            return;
        }

        // NO creamos ni enviamos id_producto, que lo hará el backend

        const nuevoProducto = {
            nombre,
            descripcion,
            precio,
            cantidad,
            categoria
        };

        try {
            const response = await fetch('/agregar-producto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto)
            });

            if (!response.ok) throw new Error('Error al agregar producto');

            // Cerrar modal
            const modalEl = document.getElementById('addProductModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            // Limpiar formulario
            document.querySelector('#addProductModal form').reset();

            // Recargar productos para actualizar tabla
            cargarProductos();

            // Mostrar la categoría del producto recién agregado
            showCategory(categoria);

        } catch (error) {
            alert('Error al agregar el producto');
            console.error(error);
        }
    });
});

// Funciones de editar y eliminar (solo placeholders, debes implementar backend)
function editarProducto(id) {
    alert('Función editar no implementada. Producto ID: ' + id);
}

function eliminarProducto(id) {
    alert('Función eliminar no implementada. Producto ID: ' + id);
}
