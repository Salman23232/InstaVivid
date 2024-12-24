import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text:{type:String, require:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    post:{type:mongoose.Schema.Types.ObjectId, ref:'Post'},
    

})

export default commentSchema = mongoose.model('Comment', commentSchema)