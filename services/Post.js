import { Post } from "../models/Post.js"

export const addPost = async (newPost) => {
    const post = new Post(newPost);
    await post.save();
    return post;
}

export const getPostById = (postId) => {
    return Post.findOne({ _id: postId });
}

export const getAllUserPostsByUserId = (id) => {
    return Post.find({ user: id });
}

export const deletePostFromDB = (id) => {
    return Post.findOneAndDelete({ _id: id });
}