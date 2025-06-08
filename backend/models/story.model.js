import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String, // 'image', 'video', etc.
      enum: ['image', 'video'],
      default: 'image',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    viewers:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}]
  },
  { timestamps: true }
);

export default mongoose.model("Story", storySchema);
