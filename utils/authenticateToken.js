import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import serverResponse from "./serverResponse.js";
import { generateAccessToken } from "../controllers/User.js";

dotenv.config();

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ONE_MINUTE_IN_MILLISECONDS } = process.env;

export const authenticateToken = (req, res, next) => {
    console.log("cookies", req.cookies)
    const accessToken = req.cookies["accessToken"];
    if (accessToken === undefined) {
        const refreshToken = req.cookies["refreshToken"];
        if (refreshToken === undefined) {
            console.log("The refresh token has expired, you need to login again");
            return serverResponse(res, 401, { message: "Token not found. The user cannot be authenticated." })
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
        console.log(user);
        req.user = user;
        console.log("authentication verified")
        next();
    });
}