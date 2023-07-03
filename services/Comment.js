import { Comment } from "../models/Comment.js"

export const addComment = async (newComment) => {
    const comment = new Comment(newComment);
    await comment.save();
    return comment;
}

export const getCommentById = (commentId) => {
    return Comment.findOne({ _id: commentId });
}

export const getAllCommentsByPostId = (postId) => {
    return Comment.find({ post: postId });
}

export const getAllCommentsByUserId = (userId) => {
    return Comment.find ({ user: userId });
}

export const deleteCommentFromDB = (id) => {
    return Comment.findOneAndDelete({ _id: id });
}