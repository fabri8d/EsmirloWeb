import { checkSession, logout } from "../utils/sessions.js";
import { contadorCarrito } from "../utils/carts.js";
import { loadCategories } from "../utils/categories.js";
document.addEventListener('DOMContentLoaded', () => {
    if (!checkSession()) return;
    contadorCarrito();
    loadCategories();
});
window.logout = logout;