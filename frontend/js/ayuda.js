import { checkSession, logout } from "../utils/sessions.js";
import	 { updateCartCount } from "../utils/carts.js";
import { loadCategories } from "../utils/categories.js";
document.addEventListener('DOMContentLoaded', () => {
    if (!checkSession()) return;
    updateCartCount();
    loadCategories()
});
window.logout = logout;