import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { addFriendController, signInController, deleteUserController, getAllFriendsByUserIdController, getUserByIdController, updateUserController, updateUserPasswordController, logoutController, deleteAllUsersController, checkAccessTokenController } from "./controllers/User.js";
import { addPostController, deletePostByIdController, getAllPostsByUserIdController, getPostByPostIdController, updatePostByPostIdController } from "./controllers/Post.js";
import { addCommentController, deleteCommentByIdController, getAllCommentsByPostIdController, getCommentByCommentIdController, updateCommentByCommentIdController } from "./controllers/Comment.js";
import { addLikeToPostOrCommentController, deleteLikeByIdController, getLikeByIdController } from "./controllers/Like.js";
import { authenticateToken } from "./utils/authenticateToken.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { PORT, DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

const app = express();
app.use(express.json());
app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.use(express.static('client/build'));
app.use(cookieParser());

/* ********************************************************************************************************************* */

app.get("/api/user/:id", getUserByIdController);
app.get("/api/user/friends/:id", getAllFriendsByUserIdController);
app.get("/api/user/jwt", checkAccessTokenController);
app.delete("/api/user/logout", authenticateToken, logoutController);
app.post("/api/user/signIn", signInController);
app.put("/api/user/:id", updateUserController);
app.put("/api/user/password/:id", updateUserPasswordController);
app.put("/api/addFriend", addFriendController);
app.delete("/api/user/:id", deleteUserController);

app.post("/api/post", addPostController);
app.get("/api/posts/:id", authenticateToken, getAllPostsByUserIdController);
app.get("/api/post/:id", getPostByPostIdController);
app.put("/api/post/:id", updatePostByPostIdController);
app.delete("/api/post/:id", deletePostByIdController);

app.post("/api/comment", addCommentController);
app.get("/api/comments/:id", getAllCommentsByPostIdController);
app.get("/api/comment/:id", getCommentByCommentIdController);
app.put("/api/comment/:id", updateCommentByCommentIdController);
app.delete("/api/comment/:id", deleteCommentByIdController);

app.post("/api/like", addLikeToPostOrCommentController);
app.get("/api/like/:id", getLikeByIdController);
app.delete("/api/like/:id", deleteLikeByIdController);

/* ********* Auxiliary routes ********* */

app.delete("/api/users", deleteAllUsersController);

/* ************************************ */

/* ********************************************************************************************************************* */

// app.get("*", (req, res) => {
//     res.sendFile(__dirname + "/client/build/index.html")
// })

async function main() {
    // await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`);
    await mongoose.connect(`mongodb://localhost:27017/`);
}

main().catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log(`NettaNet server is listening on port ${PORT}!`);
});