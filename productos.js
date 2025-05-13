
function showCategory(categoryId) {
    // Ocultar todas las categorías
    const categories = document.querySelectorAll('.category');
    categories.forEach(cat => cat.style.display = 'none');

    // Mostrar la categoría seleccionada
    const selected = document.getElementById(categoryId);
    if (selected) {
        selected.style.display = 'block';
        }
    }


