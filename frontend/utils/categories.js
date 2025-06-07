const token = localStorage.getItem("token");
export async function loadCategories() {
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