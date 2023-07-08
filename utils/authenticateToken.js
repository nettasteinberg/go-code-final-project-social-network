import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import serverResponse from "./serverResponse.js";

dotenv.config();

const { ACCESS_TOKEN_SECRET } = process.env;

export const authenticateToken = (req, res, next) => {
    const token = req.cookies["access_token_" + req.params.id];
    if (token === undefined) {
        return serverResponse(res, 401, { message: "Token not found. The user cannot be authenticated." })
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return serverResponse(res, 403, { message: "The token couldn't be verified" })
            // return res.status(403).send({message: "The token couldn't be verified"});
        }
        req.user = user;
        next();
    });
}