import { addComment, deleteComment, getAllCommentsByPostId, getCommentById } from "../services/Comment.js";
import { deleteAllLikesByPostOrCommentId, getAllLikesByPostOrCommentId } from "../services/Like.js";
import { getPostById } from "../services/Post.js";
import serverResponse from "../utils/serverResponse.js";

export const addCommentController = async (req, res) => {
    try {
        const newComment = { ...req.body };
        if (Object.keys(newComment).length === 0) {
            return serverResponse(res, 400, "Bad request");
        }
        const post = await addComment(newComment);
        return serverResponse(res, 200, post);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to add a comment"
        });
    }
}

export const getAllCommentsByPostIdController = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await getPostById(postId);
        if (!post) {
            return serverResponse(res, 404, { message: "Post doesn't exist" });
        }
        const comments = await getAllCommentsByPostId(postId);
        return serverResponse(res, 200, comments);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to get all comments by post"
        });
    }
}

export const getCommentByCommentIdController = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await getCommentById(commentId);
        if (!comment) {
            return serverResponse(res, 404, { message: "Comment doesn't exist" });
        }
        return serverResponse(res, 200, comment);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to get comment"
        });
    }
}

export const updateCommentByCommentIdController = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await getCommentById(commentId);
        if (!comment) {
            return serverResponse(res, 404, { message: "Comment doesn't exist" });
        }
        const userId = req.body.user;
        if (userId !== comment.user.toString()) {
            return serverResponse(res, 400, { message: "The user is not the original poster of the comment so the comment can't be updated" });
        }
        const { content } = req.body;
        let isValidUpdate = false;
        if (content !== "") {
            comment["content"] = content;
            isValidUpdate = true;
        }
        if (isValidUpdate) {
            comment.updatedAt = Date.now();
            await comment.save();
        }
        return serverResponse(res, 200, comment);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to update a comment"
        });
    }
}

export const deleteLikesOnComment = async (commentId) => {
    const arrayOfLikesOnComment = await getAllLikesByPostOrCommentId(false, commentId);
    console.log(arrayOfLikesOnComment)
    const deleteLikesResponse = await deleteAllLikesByPostOrCommentId(false, commentId);
    console.log(deleteLikesResponse)
    if (deleteLikesResponse.deletedCount !== arrayOfLikesOnComment.length) {
        console.log(`Not all likes of comment ${commentId} were deleted from the DB`);
    }
    return await deleteComment(commentId);
}

export const deleteCommentByIdController = async (req, res) => {
    try {
        const commentId = req.params.id;
        // const comment = await getCommentById(commentId);
        // if (!comment) {
        //     return serverResponse(res, 404, { message: "Comment doesn't exist" });
        // }
        // const userId = req.body.user;
        // const post = await getPostById(comment.post.toString());
        // const postPoster = await getUserById(post.user.toString());
        // if (userId !== comment.user.toString() && userId !== postPoster._id.toString()) {
        //     return serverResponse(res, 400, { message: "The user is neither the original poster of the comment nor the original poster of the post, so the comment can't be deleted" });
        // }
        const deletedComment = await deleteLikesOnComment(commentId);
        if (!deletedComment) {
            return serverResponse(res, 404, { message: "Comment doesn't exist" });
        }
        return serverResponse(res, 200, deletedComment);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to delete a comment"
        });
    }
}