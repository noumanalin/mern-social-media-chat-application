import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
    creator: { type: Schema.Types.ObjectId, ref:"User"},
    body: { type:String, required:true},
    image: {type:String, required:true},
    likes:[{type:Schema.Types.ObjectId, ref:"User"}],
    comments:[{type:Schema.Types.ObjectId, ref:"Comment"}]
}, {timestamps:true})

const Post = mongoose.model("Post", postSchema);

export default Post;