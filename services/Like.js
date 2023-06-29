import { Like } from "../models/Like.js";

export const addLike = async (newLike) => {
    const like = new Like(newLike);
    await like.save();
    return like;
}

export const getLikeById = (likeId) => {
    return Like.findOne({ _id: likeId });
}

export const getAllLikesByPostOrCommentId = (isPost, id) => {
    return Like.find({ likedObject: id });
}

export const deleteLike = (id) => {
    return Like.findOneAndDelete({ _id: id });
}

export const deleteAllLikesByPostOrCommentId = (isPost, id) => {
    return Like.deleteMany({ likedObject: id });
}