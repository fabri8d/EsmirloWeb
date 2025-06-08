import { checkSession, logout } from "../utils/sessions.js";
document.addEventListener("DOMContentLoaded", () => {
  if (!checkSession()) return;
});
window.logout = logout;