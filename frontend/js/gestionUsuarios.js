import { checkSession, logout } from "../utils/sessions.js";
const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", () => {
    if (!checkSession()) return;
    cargarUsuarios();
});

async function cargarUsuarios() {
    try {
        const response = await fetch("http://localhost:3000/users/getUsers", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Error al obtener usuarios");

        const users = await response.json();
        llenarTablaUsuarios(users);
    } catch (error) {
        alert("No se pudieron cargar los usuarios.");
        console.error(error);
    }
}

function llenarTablaUsuarios(users) {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = ""; // limpiar tabla

  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.firstName} ${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="bloquearUsuario(${user.id})">Bloquear</button>
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
  if (!confirm("¿Estás seguro de bloquear este usuario?")) return;

  try {
    const response = await fetch(`http://localhost:3000/users/blockUser/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error();

    alert("Usuario bloqueado correctamente");
    location.reload();
  } catch (err) {
    alert("Error al bloquear usuario");
  }
}
window.eliminarUsuario = eliminarUsuario;
window.bloquearUsuario = bloquearUsuario;
window.logout = logout; 