import { Schema, model } from "mongoose";

const postSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    picture: {
        type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
  });

export const User = model("Post", postSchema);