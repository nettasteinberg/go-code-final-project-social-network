import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { addFriendController, addUserController, deleteUserController, getAllFriendsByUserId, getUserByIdController, updateUserController, updateUserPasswordController } from "./controllers/User.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { PORT, DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('client/build'));

/* ********************************************************************************************************************* */

app.get("/api/user/:id", getUserByIdController);
app.get("/api/user/friends/:id", getAllFriendsByUserId);
app.post("/api/user", addUserController);
app.put("/api/user/:id", updateUserController);
app.put("/api/user/password/:id", updateUserPasswordController);
app.put("/api/addFriend", addFriendController);
app.delete("/api/user/:id", deleteUserController);

/* ********************************************************************************************************************* */

// app.get("*", (req, res) => {
//     res.sendFile(__dirname + "/client/build/index.html")
// })

async function main() {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`);
}

main().catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log(`NettaNet server is listening on port ${PORT}!`);
});