import { User } from "../models/User.js"

export const getUserById = (id) => {
    return User.findOne({_id:id}).select("-password -__v");
}

export const getUserByEmail = (email) => {
    return User.findOne({email}).select("-__v");
}

export const addUser = async (newUser) => {
    const user = new User(newUser);
    await user.save();
    return user;
}

export const updateUser = async (user) => {
    await user.save();
    return user;
}

export const deleteUserFromDBById = (id) => {
    return User.findOneAndDelete({_id:id});
}

/* *************************************** */

export const getNumberOfUsers = () => {
    return User.countDocuments({});
}

export const deleteAllUsers = () => {
    return User.deleteMany({});
}