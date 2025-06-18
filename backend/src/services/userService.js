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
async function getUsersFilteredService(dataSource, filters) {
    const userRepo = dataSource.getRepository(User);
    const { firstName, lastName, username, role, page = 1, limit = 10 } = filters;

    let query = userRepo.createQueryBuilder("user");

    if (firstName) {
        query = query.andWhere("user.firstName ILIKE :firstName", { firstName: `%${firstName}%` });
    }
    if (lastName) {
        query = query.andWhere("user.lastName ILIKE :lastName", { lastName: `%${lastName}%` });
    }
    if (username) {
        query = query.andWhere("user.username ILIKE :username", { username: `%${username}%` });
    }
    if (role) {
        query = query.andWhere("user.role = :role", { role });
    }



    const skip = (page - 1) * limit;

    const [users, total] = await query
        .skip(skip)
        .take(limit)
        .getManyAndCount();

    return {
        users,
        total
    };

}

module.exports = {
    getUsersService,
    getUserByIdService,
    getUserByUsernameService,
    deleteUserService,
    getUsersFilteredService
};
