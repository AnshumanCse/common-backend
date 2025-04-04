const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    image: {
      type: String, 
      required: [true, "Image is required"],
    },
    likes: {
      type: Number,
      default: 0, 
    },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
        commentText: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } 
);

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
