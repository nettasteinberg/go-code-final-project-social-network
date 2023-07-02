import { getAllCommentsByPostId } from "../services/Comment.js";
import { deleteAllLikesByPostOrCommentId, getAllLikesByPostOrCommentId } from "../services/Like.js";
import { addPost, deletePost, getAllUserPostsByUserId, getPostById } from "../services/Post.js";
import { getUserById } from "../services/User.js";
import serverResponse from "../utils/serverResponse.js";
import { deleteLikesOnComment } from "./Comment.js";

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
        const post = await getPostById(postId);
        if (!post) {
            return serverResponse(res, 404, { message: "Post doesn't exist" });
        }
        return serverResponse(res, 200, post);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to get post"
        });
    }
}

export const updatePostByPostIdController = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await getPostById(postId);
        if (!post) {
            return serverResponse(res, 404, { message: "Post doesn't exist" });
        }
        const userId = req.body.user;
        if (userId !== post.user.toString()) {
            return serverResponse(res, 400, { message: "The user is not the original poster so the post can't be updated" });
        }
        const { content, picture } = req.body;
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

export const deleteCommentsAndLikesOnPost = async (postId) => {
    const commentsOnPost = await getAllCommentsByPostId(postId);
    for (const comment of commentsOnPost) {
        const deletedComment = await deleteLikesOnComment(comment._id);
        console.log(`Deleted comment ${comment._id} of post ${postId}`);
        if (!deletedComment) {
            console.log(`Comment ${comment._id} wasn't deleted properly`);
        }
    }
    const arrayOfLikesOnComment = await getAllLikesByPostOrCommentId(true, postId);
    const deleteLikesResponse = await deleteAllLikesByPostOrCommentId(true, postId);
    console.log(`Deleted ${deleteLikesResponse.deletedCount} likes of post ${postId}`);
    if (deleteLikesResponse.deletedCount !== arrayOfLikesOnComment.length) {
        console.log(`Not all likes of post ${postId} were deleted from the DB`);
    }
}

export const deletePostByIdController = async (req, res) => {
    try {
        const postId = req.params.id;
        await deleteCommentsAndLikesOnPost(postId);
        const deletedPost = await deletePost(postId);
        if (!deletedPost) {
            return serverResponse(res, 404, { message: "Post doesn't exist" });
        }
        return serverResponse(res, 200, deletedPost);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to delete a post"
        });
    }
}