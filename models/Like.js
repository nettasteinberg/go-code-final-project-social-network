import { Schema, model } from "mongoose";

const likeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likedObject: { 
        type: Schema.Types.ObjectId, 
        refPath: 'model_type',
        required: true, 
    },
    modelType: { 
        type: String, 
        enum: ["Post", "Comment"], 
        required: true,
    }

    // post: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Post",
    // },
    // comment: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Comment",
    // }
});

export const Like = model("Like", likeSchema);