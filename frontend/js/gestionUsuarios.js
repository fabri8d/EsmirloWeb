import { checkSession, logout } from "../utils/sessions.js";
const token = localStorage.getItem("token");
let pagina = 1;
const limite = 5;
document.addEventListener("DOMContentLoaded", () => {
  if (!checkSession()) return;
  aplicarFiltros(1);
  document.getElementById("filtro-nombre").addEventListener("change", (e) => aplicarFiltros(1));
  document.getElementById("filtro-apellido").addEventListener("change", (e) => aplicarFiltros(1));
  document.getElementById("filtro-username").addEventListener("change", (e) => aplicarFiltros(1));
  document.getElementById("filtro-rol").addEventListener("change", (e) => aplicarFiltros(1));
  document.getElementById("btnAnterior").addEventListener("click", () => {
    if (pagina > 1) aplicarFiltros(pagina - 1);
  });

  document.getElementById("btnSiguiente").addEventListener("click", () => {
    aplicarFiltros(pagina + 1);
  });
});
async function aplicarFiltros(nuevaPagina = 1) {
  pagina = nuevaPagina;

  const nombreSeleccionado = document.getElementById("filtro-nombre").value;
  const apellidoSeleccionado = document.getElementById("filtro-apellido").value;
  const usernameSeleccionado = document.getElementById("filtro-username").value;
  const rolSeleccionado = document.getElementById("filtro-rol").value;
  const queryParams = new URLSearchParams();

  if (nombreSeleccionado) queryParams.append("firstName", nombreSeleccionado);
  if (apellidoSeleccionado) queryParams.append("lastName", apellidoSeleccionado);
  if (usernameSeleccionado) queryParams.append("username", usernameSeleccionado);
  if (rolSeleccionado) queryParams.append("role", rolSeleccionado);

  queryParams.append("page", pagina);
  queryParams.append("limit", limite);

  try {
    const res = await fetch(`http://localhost:3000/users/getUsersFiltered?${queryParams.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const users = Array.isArray(data) ? data : data.users;
    const total = data.total ?? (Array.isArray(data) ? data.length : 0);

    cargarUsuarios(users);
    actualizarPaginacion(total);
  } catch (error) {
    console.error("Error al aplicar filtros:", error);
  }
}
function actualizarPaginacion(total) {
  const totalPaginas = Math.ceil(total / limite);
  document.getElementById("paginaActual").textContent = `Página ${pagina} de ${totalPaginas}`;

  document.getElementById("btnAnterior").disabled = pagina <= 1;
  document.getElementById("btnSiguiente").disabled = pagina >= totalPaginas;
}



function cargarUsuarios(users) {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  users.forEach(user => {
    const tr = document.createElement("tr");
    const textoBoton = user.enabled ? "Bloquear" : "Desbloquear";
    const estadoTexto = user.enabled ? "Activo" : "Bloqueado";

    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.firstName} ${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${estadoTexto}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="bloquearUsuario(${user.id})">${textoBoton}</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${user.id})">Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}



async function eliminarUsuario(id) {
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

  try {
    const response = await fetch(`http://localhost:3000/users/deleteUser/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error();

    alert("Usuario eliminado correctamente");
    location.reload();
  } catch (err) {
    alert("Error al eliminar usuario");
  }
};
async function bloquearUsuario(id) {
  if (!confirm("¿Estás seguro de cambiar el estado de este usuario?")) return;

  try {
    const response = await fetch(`http://localhost:3000/users/blockUser/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error();

    alert("Se cambió el estado con exito.");
    location.reload();
  } catch (err) {
    alert("Error al bloquear usuario");
  }
}
window.eliminarUsuario = eliminarUsuario;
window.bloquearUsuario = bloquearUsuario;
window.logout = logout; 