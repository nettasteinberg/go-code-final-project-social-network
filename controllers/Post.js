import { addPost, getAllUserPostsByUserId, getPostByPostId } from "../services/Post.js";
import { getUserById } from "../services/User.js";
import serverResponse from "../utils/serverResponse.js";

export const addPostController = async (req, res) => {
    try {
        const newPost = { ...req.body };
        console.log(newPost);
        if (Object.keys(newPost).length === 0) {
            serverResponse(res, 400, "Bad request");
        }
        const post = await addPost(newPost);
        serverResponse(res, 200, post);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to add a post"
        });
    }
}

export const getAllPostsByUserIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUserById(id);
        if (!user) {
            return serverResponse(res, 404, { message: "User doesn't exist" });
        }
        const posts = await getAllUserPostsByUserId(id);
        return serverResponse(res, 200, posts);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to get all posts by user"
        });
    }
}

export const getPostByPostIdController = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await getPostByPostId(postId);
        if (!post) {
            return serverResponse(res, 404, { message: "Post doesn't exist" });
        }
        return serverResponse(res, 200, post);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to get all posts by user"
        });
    }
}

export const updatePostByPostIdController = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await getPostByPostId(postId);
        if (!post) {
            return serverResponse(res, 404, { message: "Post doesn't exist" });
        }
        const userId = req.body.user;
        if (userId !== post.user.toString()) {
            console.log("userId", userId);
            console.log("post.user", post.user);
            return serverResponse(res, 400, { message: "The user didn't post the post so it can't be updated" });
        }
        const {content , picture} = req.body;
        let isValidUpdate = false;
        if (content !== "") {
            post["content"] = content;
            isValidUpdate = true;
        }
        if (picture !== "") {
            post["picture"] = picture;
            isValidUpdate = true;
        }
        if (isValidUpdate) {
            post.updatedAt = Date.now();
            await post.save();
        }
        return serverResponse(res, 200, post);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to update a post"
        });
    }
} 