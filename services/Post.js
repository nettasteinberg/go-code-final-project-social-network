import { Post } from "../models/Post.js"

export const addPost = async (newPost) => {
    const post = new Post(newPost);
    await post.save();
    return post;
}

export const getPostByPostId = (postId) => {
    return Post.findOne({ _id: postId });
}

export const getAllUserPosts = (id) => {
    return Post.find({ user: id });
}