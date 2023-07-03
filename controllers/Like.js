import { addLike, deleteAllLikesByPostOrCommentId, deleteLike, getAllLikesByPostOrCommentId, getLikeById } from "../services/Like.js";
import serverResponse from "../utils/serverResponse.js";

export const addLikeToPostOrCommentController = async (req, res) => {
    try {
        const newLike = { ...req.body };
        if ((Object.keys(newLike).length === 0)) {
            return serverResponse(res, 400, "Bad request");
        }
        const like = await addLike(newLike);
        return serverResponse(res, 200, like);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to add a comment"
        });
    }
}

export const getLikeByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const like = await getLikeById(id);
        if (!like) {
            return serverResponse(res, 404, { message: "Like doesn't exist" });
        }
        return serverResponse(res, 200, like);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to add a comment"
        });
    }
}

export const deleteLikesOnCommentOrPost = async (id, isPost) => {
    const arrayOfLikesOnComment = await getAllLikesByPostOrCommentId(id);
    const deleteLikesResponse = await deleteAllLikesByPostOrCommentId(id);
    console.log(`Delete ${deleteLikesResponse.deletedCount} likes of ${isPost ? "post" : "comment"} ${id}`);
    if (deleteLikesResponse.deletedCount !== arrayOfLikesOnComment.length) {
        console.log(`Not all likes of ${isPost ? "post" : "comment"} ${id} were deleted from the DB`);
    }
}

export const deleteLikeByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const like = await getLikeById(id);
        if (!like) {
            return serverResponse(res, 404, { message: "Like doesn't exist" });
        }
        const userId = req.body.user;
        if (userId !== like.user.toString()) {
            return serverResponse(res, 400, { message: `The user is not the original liker of the ${like.modelType === "Post" ? "post" : "comment"}, so the like can't be removed` });
        }
        const deletedLike = await deleteLike(id);
        if (!deletedLike) {
            return serverResponse(res, 404, { message: "Comment doesn't exist" });
        }
        return serverResponse(res, 200, deletedLike);
    } catch (e) {
        return serverResponse(res, 500, {
            message: "Internal error while trying to add a comment"
        });
    }
}