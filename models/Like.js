import { Schema, model } from "mongoose";

const likeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likedObject: { 
        type: Schema.Types.ObjectId, 
        refPath: 'modelType',
        required: true, 
    },
    modelType: { 
        type: String, 
        enum: ["Post", "Comment"], 
        required: true,
    }
});

export const Like = model("Like", likeSchema);