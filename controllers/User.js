import { getAllCommentsByUserId } from "../services/Comment.js";
import { deleteUserLikesByUserId } from "../services/Like.js";
import { getAllUserPostsByUserId } from "../services/Post.js";
import { addUser, deleteAllUsers, deleteUserFromDBById, getNumberOfUsers, getUserById, updateUser } from "../services/User.js";
import { passwordAllowedUpdate, userAllowedUpdates } from "../utils/allowedUpdates.js";
import { enforceStrongPassword } from "../utils/enforceStrongPassword.js";
import { hashPassword } from "../utils/hashPassword.js";
import serverResponse from "../utils/serverResponse.js";
import { deleteComment } from "./Comment.js";
import { deletePost } from "./Post.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ONE_MINUTE_IN_MILLISECONDS, ONE_DAY_IN_MILLISECONDS } = process.env;

export const signInController = async (req, res) => {
    try {
        const newUser = { ...req.body };
        if (Object.keys(newUser).length === 0) {
            return serverResponse(res, 400, "Bad request");
        }
        const email = newUser.email;
        const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
        if (!emailRegex.test(email)) {
            return serverResponse(res, 400, { message: "The email is not in valid form" });
        }
        if (!enforceStrongPassword(req.body.password)) {
            return serverResponse(res, 400, { message: "The password is too weak, it should be no fewer than 8 characters, with at least one uppercase letter, at least one lowercase letter, at least one digit and at least one special character" });
        }
        newUser.password = await hashPassword(req.body.password);
        const user = await addUser(newUser);

        const accessToken = generateAccessToken(user);
        res.cookie("accessToken", accessToken, { maxAge: ONE_MINUTE_IN_MILLISECONDS * 10, httpOnly: true});
        const refreshToken = jwt.sign(user.toJSON(), REFRESH_TOKEN_SECRET);
        res.cookie("refreshToken", refreshToken, { maxAge: ONE_DAY_IN_MILLISECONDS * 30, httpOnly: true});
        console.log("new user signed in: ", user._id);
        return serverResponse(res, 200, user);
    } catch (e) {
        console.log(e.message);
        return serverResponse(res, 500, e);
    }
}

export const generateAccessToken = (user) => {
    return jwt.sign(user.toJSON(), ACCESS_TOKEN_SECRET, { expiresIn: ONE_MINUTE_IN_MILLISECONDS * 10 });
}

export const checkAccessTokenController = async (req, res) => {
    try {
        console.log("checkAccessTokenController entry");
        const accessToken = req.cookies["accessToken"];
        console.log("access token", accessToken);
        if (accessToken === undefined) {
            const refreshToken = req.cookies["refreshToken"];
            console.log("refresh token", refreshToken);
            if (refreshToken === undefined) {
                console.log("The refresh token has expired, you need to login again");
                return serverResponse(res, 401, { message: "Token not found. The user cannot be authenticated." });
            }
            jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return serverResponse(res, 403, { message: "The refresh token couldn't be verified" });
                }
                console.log("generating new access token");
                const accessToken = generateAccessToken(user);
                res.cookie("accessToken", accessToken, { maxAge: ONE_MINUTE_IN_MILLISECONDS * 10, httpOnly: true });
            });
        }
        jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return serverResponse(res, 403, { message: "The access token couldn't be verified" });
                // return res.status(403).send({message: "The token couldn't be verified"});
            }
            return serverResponse(res, 200, user);
        });
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to check access token"
        });
    }
}

export const logoutController = async (req, res) => {
    deleteUser(req.user);
    res.clearCookie("accessToken", { httpOnly: true});
    res.clearCookie("refreshToken", { httpOnly: true});
    res.clearCookie("undefined");
    serverResponse(res, 200, { message: "Logged out successfully!" });
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

const deleteUser = async (user) => {
    await deleteUserFromFriendsLists(user);
    const id = user._id;
    await deleteUserLikesByUserId(id);
    const userComments = await getAllCommentsByUserId(id);
    for (const comment of userComments) {
        await deleteComment(comment._id);
    }
    const userPosts = await getAllUserPostsByUserId(id);
    for (const post of userPosts) {
        await deletePost(post._id);
    }
    return await deleteUserFromDBById(user._id);
}

const deleteUserFromFriendsLists = async (user) => {
    const friendsOfUserToDelete = [...user.friends];
    for (const friendId of friendsOfUserToDelete) {
        const friendToDeleteUserFrom = await getUserById(friendId);
        const newFriendsList = [...friendToDeleteUserFrom.friends];
        const ind = newFriendsList.findIndex(friendId => friendId.toString() === user._id);
        newFriendsList.splice(ind, 1);
        friendToDeleteUserFrom.friends = newFriendsList;
        await updateUser(friendToDeleteUserFrom);
    }
}

export const deleteUserController = async (req, res) => {
    try {
        const id = req.params.id;
        const userToDelete = await getUserById(id);
        if (!userToDelete) {
            return serverResponse(res, 404, { message: "User doesn't exist" });
        }
        const deletedUser = await deleteUser(userToDelete);
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

/* ******************************* auxiliary controllers ******************************* */
export const deleteAllUsersController = async (req, res) => {
    const numberOfUsers = await getNumberOfUsers();
    const deletedUsers = await deleteAllUsers();
    if (deletedUsers.deletedCount !== numberOfUsers) {
        return serverResponse(res, 404, { message: `Failed to delete all the users` });
    }
    return serverResponse(res, 200, deletedUsers);
}