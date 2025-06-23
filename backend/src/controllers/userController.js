const { AppDataSource } = require("../data-base/data-source.js");
const userService = require("../services/userService.js");

async function getUsers(req, res) {
    try {
        const dataSource = req.app.get("dataSource");

        const users = await userService.getUsersService(dataSource);
        res.json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "No se pudieron obtener los usuarios" });
    }
}
async function getUserById(req, res) {
    const userId = req.params.id;
    try {
        const dataSource = req.app.get("dataSource");
        const user = await userService.getUserByIdService(dataSource, userId);
        res.json(user);
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({ error: "No se pudo obtener el usuario" });
    }
}
async function getUserByUsername(req, res) {
    const username = req.params.username;
    try {
        const dataSource = req.app.get("dataSource");
        const user = await userService.getUserByUsernameService(dataSource, username);
        res.json(user);
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({ error: "No se pudo obtener el usuario" });
    }
}
async function deleteUser(req, res) {
    const userId = req.params.id;
    try {
        const dataSource = req.app.get("dataSource");
        const result = await userService.deleteUserService(dataSource, userId);
        res.json(result);
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({ error: "No se pudo eliminar el usuario" });
    }
}
async function getUsersFiltered(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const { firstName, lastName, username, role, page = 1, limit = 5 } = req.query;
    const filters = {
      firstName, 
      lastName, 
      username, 
      role,
      page: parseInt(page),
      limit: parseInt(limit)
    };
    const { users, total } = await userService.getUsersFilteredService(dataSource, filters);
    res.json({users, total});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function subscribeNotifications(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const username = req.params.username;
    const result = await userService.subscribeNotificationsService(dataSource, username);
    res.json(result);
  } catch (error) {
    console.error("Error al actualizar suscripción:", error);
    if (error.message === "Usuario no encontrado") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "Ya se encuentra subscripto.") {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
async function blockUser(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const id = req.params.id;
    const result = await userService.blockUserService(dataSource, id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
    getUsers,
    getUserById,
    getUserByUsername,
    deleteUser,
    getUsersFiltered,
    subscribeNotifications,
    blockUser
};