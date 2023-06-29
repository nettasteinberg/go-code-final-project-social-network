import { Like } from "../models/Like.js";

export const addLike = async (newLike) => {
    const like = new Like(newLike);
    await like.save();
    return like;
}

export const getLikeById = (likeId) => {
    return Like.findOne({ _id: likeId });
}

export const getAllLikesByPostId = (postId) => {
    return Like.find({ likedObject: postId, modelType: "Post" });
}

export const getAllLikesByCommentId = (commentId) => {
    return Like.find({ likedObject: commentId, modelType: "Comment" });
}

export const deleteLike = (id) => {
    return Like.findOneAndDelete({ _id: id });
}