const User = require("../models/users/User");

async function getUsersService(dataSource) {
    const userRepo = dataSource.getRepository(User);
    try {
        return await userRepo.find();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Could not retrieve users");
    }
}

async function getUserByIdService(dataSource, userId) {
    const userRepo = dataSource.getRepository(User);
    try {
        const user = await userRepo.findOne({
            where: { id: parseInt(userId) },
        });
        if (!user) throw new Error("User not found");
        return user;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw new Error("Could not retrieve user");
    }
}
async function getUserByUsernameService(dataSource, username) {
    const userRepo = dataSource.getRepository(User);
    try {
        const user = await userRepo.findOne({
            where: { username: username },
        });
        if (!user) throw new Error("User not found");
        return user;
    } catch (error) {
        console.error("Error fetching user by username:", error);
        throw new Error("Could not retrieve user");
    }
}
async function deleteUserService(dataSource, userId) {
    const userRepo = dataSource.getRepository(User);
    try {
        const user = await userRepo.findOne({
            where: { id: parseInt(userId) },
        });
        if (!user) throw new Error("User not found");
        await userRepo.remove(user);
        return { message: "User deleted successfully" };
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Could not delete user");
    }
}

module.exports = {
    getUsersService, 
    getUserByIdService,
    getUserByUsernameService,
    deleteUserService
};
