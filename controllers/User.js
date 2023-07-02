import { deleteUserLikesByUserId } from "../services/Like.js";
import { getAllUserPostsByUserId } from "../services/Post.js";
import { addUser, deleteUserById, getUserById } from "../services/User.js";
import { passwordAllowedUpdate, userAllowedUpdates } from "../utils/allowedUpdates.js";
import { enforceStrongPassword } from "../utils/enforceStrongPassword.js";
import { hashPassword } from "../utils/hashPassword.js";
import serverResponse from "../utils/serverResponse.js";
import { deleteCommentsAndLikesOnPost } from "./Post.js";

export const addUserController = async (req, res) => {
    try {
        const newUser = { ...req.body };
        if (Object.keys(newUser).length === 0) {
            serverResponse(res, 400, "Bad request");
        }
        const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
        if (!emailRegex.test(newUser.email)) {
            return serverResponse(res, 400, { message: "The email is not in valid form" });
        }
        if (!enforceStrongPassword(req.body.password)) {
            return serverResponse(res, 400, { message: "The password is too weak, it should be no fewer than 8 characters, with at least one uppercase letter, at least one lowercase letter, at least one digit and at least one special character" });
        }
        newUser.password = await hashPassword(req.body.password);
        const user = await addUser(newUser);
        serverResponse(res, 200, user);
    } catch (e) {
        serverResponse(res, 500, e);
    }
}

export const getUserByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUserById(id);
        if (!user) {
            return serverResponse(res, 404, { message: "User doesn't exist" });
        }
        return serverResponse(res, 200, user);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to get user details"
        });
    }
}

export const getAllFriendsByUserIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUserById(id);
        if (!user) {
            return serverResponse(res, 404, { message: "User doesn't exist" });
        }
        return serverResponse(res, 200, user.friends);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to get user's friends"
        });
    }
}

export const deleteUserController = async (req, res) => {
    try {
        const id = req.params.id;
        const userToDelete = await getUserById(id);
        if (!userToDelete) {
            return serverResponse(res, 404, { message: "User doesn't exist" });
        }
        const friendsOfUserToDelete = [...userToDelete.friends];
        for (const friendId of friendsOfUserToDelete) {
            const friendToDeleteUserFrom = await getUserById(friendId);
            const newFriendsList = [...friendToDeleteUserFrom.friends];
            const ind = newFriendsList.findIndex(friendId => friendId.toString() === id);
            newFriendsList.splice(ind, 1);
            friendToDeleteUserFrom.friends = newFriendsList;
            await friendToDeleteUserFrom.save();
        }
        const userPosts = await getAllUserPostsByUserId(id);
        for (const post of userPosts) {
            await deleteCommentsAndLikesOnPost(post._id);
        }
        const deletedLikes = await deleteUserLikesByUserId(id);
        console.log(`Removed ${deletedLikes.deletedCount} likes by user ${id}`);
        const deletedUser = await deleteUserById(id);
        return serverResponse(res, 200, deletedUser);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to remove remove user"
        });
    }
}

export const updateUserController = async (req, res) => {
    const updates = Object.keys(req.body);
    let isValidOperation = updates.every((update) => userAllowedUpdates.includes(update));
    if (!isValidOperation) {
        return serverResponse(res, 400, { message: "Invalid updates - you tried to update a field that doesn't exist or a field that can't be updated" })
    }
    try {
        const id = req.params.id;
        const user = await getUserById(id);
        if (!user) {
            return serverResponse(res, 404, { message: `Invalid updates - user with id ${id} doesn't exist` });
        }
        updates.forEach((update) => (user[update] = req.body[update]));
        user.updatedAt = Date.now();
        await user.save();
        return serverResponse(res, 200, user);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to update user"
        });
    }
}

export const updateUserPasswordController = async (req, res) => {
    const updates = Object.keys(req.body);
    let isValidOperation = updates.every((update) => passwordAllowedUpdate.includes(update));
    if (!isValidOperation) {
        return serverResponse(res, 400, { message: "Invalid update - you tried to update a field other than password" })
    }
    try {
        const id = req.params.id;
        const user = await getUserById(id);
        if (!user) {
            return serverResponse(res, 404, { message: `Invalid updates - user with id ${id} doesn't exist` });
        }
        if (!enforceStrongPassword(req.body.password)) {
            return serverResponse(res, 400, { message: "The password is too weak, it should be no fewer than 8 characters, with at least one uppercase letter, at least one lowercase letter, at least one digit and at least one special character" });
        }
        user.password = await hashPassword(req.body.password);
        user.updatedAt = Date.now();
        await user.save();
        return serverResponse(res, 200, user);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to update user"
        });
    }
}

export const addFriendController = async (req, res) => {
    try {
        const friends = { ...req.body };
        const user = await getUserById(friends.userId);
        const newFriend = await getUserById(friends.friendId);
        if (!user || !newFriend) {
            return serverResponse(res, 404, { message: `Either the user or the new friend doesn't exist` });
        }
        user.friends.push(newFriend);
        newFriend.friends.push(user);
        await user.save();
        await newFriend.save();
        return serverResponse(res, 200, user);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to add a user to the friends list"
        });
    }
}