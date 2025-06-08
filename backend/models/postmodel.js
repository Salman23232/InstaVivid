import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption:{type:String, default:''},
    image:String,
    video:String,
    likes:[
        {type:mongoose.Schema.Types.ObjectId, ref:'User'}
    ],
    bookmark:[
        {type:mongoose.Schema.Types.ObjectId, ref:'User'}
    ],
    comments: [
        {type:mongoose.Schema.Types.ObjectId, ref:'Comment'}
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId, ref:'User'
    },
    

},{timestamps:true})

export const Post = mongoose.model('Post', postSchema)