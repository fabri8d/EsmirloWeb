import { checkSession, logout } from "../utils/sessions.js";
const createMessage = document.getElementById("create-message");
const purchaseMessage = document.getElementById("purchase-message");
const categorySelect = document.getElementById("category-select");
const variantsContainer = document.getElementById("variants-container");

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

document.addEventListener('DOMContentLoaded', () => {
  if (!checkSession()) return;
  if (role !== "admin") {
    console.log("Debes ser administrador.");
    return;
  }

  loadCategoriesOnCreate();
  agregarVariante(); 
});

document.getElementById("createCategory").addEventListener("click", async e => {
  e.preventDefault();
  const categoryName = document.getElementById("new-category").value.trim();
  
  if (!categoryName) return;

  try {
    const res = await fetch("http://localhost:3000/categories/createCategory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name: categoryName }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Error: " + (data.error || res.statusText));
      return;
    }

    console.log(`Categoria creada: ID ${data.id}`);
    const createMessage = document.getElementById("create-message");
    loadCategoriesOnCreate()
    createMessage.textContent = "Categoría creada exitosamente.";
    createMessage.classList.remove("d-none");
  } catch (err) {
    console.log("Error de conexión.", err);
  }
});

document.getElementById("product-form").addEventListener("submit", async e => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("name", document.getElementById("name").value.trim());
  formData.append("description", document.getElementById("description").value.trim());
  formData.append("category", categorySelect.value);
  formData.append("price", parseFloat(document.getElementById("price").value));

  const imageFileInput = document.getElementById("imageFile");
  if (imageFileInput.files.length > 0) {
    formData.append("image", imageFileInput.files[0]);  
  }

  const variants = [...variantsContainer.children].map(div => ({
    color: div.querySelector(".variant-color").value.trim(),
    size: div.querySelector(".variant-size").value.trim(),
    stock: parseInt(div.querySelector(".variant-stock").value),
  }));

  formData.append("variants", JSON.stringify(variants));

  try {
    const res = await fetch("http://localhost:3000/products/createProduct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      console.log("Error: " + (data.error || res.statusText));
      return;
    }

    console.log(`Producto creado: ID ${data.id}`);
    createMessage.textContent = "Producto creado exitosamente.";
    createMessage.classList.remove("d-none");
  } catch (err) {
    console.log("Error de conexión.", err);
  }
});

async function loadCategoriesOnCreate() {
  try {
    const res = await fetch("http://localhost:3000/categories/getCategories", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const categories = await res.json();
    if (res.ok && Array.isArray(categories)) {
      categorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
    } else {
      console.error("Error al cargar categorías:", categories.error || res.statusText);
    }
  } catch (err) {
    console.error("Error al cargar categorías:", err.message);
  }
}

function agregarVariante() {
  const variantForm = document.createElement("div");
  variantForm.classList.add("row", "gx-2", "mb-2");

  variantForm.innerHTML = `
    <div class="col-md-4">
      <input type="text" class="form-control variant-color" placeholder="Color" required>
    </div>
    <div class="col-md-4">
      <input type="text" class="form-control variant-size" placeholder="Talle" required>
    </div>
    <div class="col-md-3">
      <input type="number" class="form-control variant-stock" placeholder="Stock" min="0" value="0" required>
    </div>
    <div class="col-md-1 d-flex align-items-center">
      <button type="button" class="btn btn-danger btn-sm remove-variant">X</button>
    </div>
  `;

  variantForm.querySelector(".remove-variant").addEventListener("click", () => {
    variantForm.remove();
  });

  variantsContainer.appendChild(variantForm);
}


window.agregarVariante = agregarVariante;
window.logout = logout;