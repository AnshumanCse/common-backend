const Blog = require("../model/BlogsModel");

/**
 * @description : Create a new blog post.
 * @param {Object} req : The request object including body for title, description, and image.
 * @param {Object} res : The response object to send back the created blog details.
 * @fields : title, description, image
 * @return {Object} : Status message indicating the result of the operation and created blog details. {status, message, blog}
 */
const createBlog = async (req, res, next) => {
    try {
      const { title, description } = req.body;
      const image = req.file?.path; // Get uploaded image URL from Cloudinary
  
      if (!title || !description || !image) {
        return res.badRequest({ message: "All fields are required." });
      }
  
      const blog = await Blog.create({ title, description, image });
  
      return res.status(201).json({
        status: "success",
        message: "Blog created successfully!",
        blog,
      });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  };
/**
 * @description : Retrieve all blog posts.
 * @param {Object} req : The request object.
 * @param {Object} res : The response object to send back the list of blogs.
 * @return {Object} : List of blog posts. {status, blogs}
 */
const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      blogs,
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : Retrieve a single blog post by ID.
 * @param {Object} req : The request object including params for blog ID.
 * @param {Object} res : The response object to send back the blog details.
 * @fields : id (params)
 * @return {Object} : Blog details. {status, blog}
 */
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.notFound({ message: "Blog not found." });
    }

    return res.status(200).json({
      status: "success",
      blog,
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : Update a blog post.
 * @param {Object} req : The request object including params for blog ID and body for updated fields.
 * @param {Object} res : The response object to send back the updated blog details.
 * @fields : id (params), title, description, image (optional)
 * @return {Object} : Status message and updated blog details. {status, message, blog}
 */
const updateBlog = async (req, res, next) => {
    try {
      const { title, description } = req.body;
      const image = req.file?.path; // Optional updated image
  
      const updateData = { title, description };
      if (image) updateData.image = image;
  
      const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
  
      if (!blog) {
        return res.notFound({ message: "Blog not found." });
      }
  
      return res.status(200).json({
        status: "success",
        message: "Blog updated successfully!",
        blog,
      });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  };

/**
 * @description : Delete a blog post.
 * @param {Object} req : The request object including params for blog ID.
 * @param {Object} res : The response object to send back the deletion status.
 * @fields : id (params)
 * @return {Object} : Status message indicating deletion result. {status, message}
 */
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.notFound({ message: "Blog not found." });
    }

    return res.status(200).json({
      status: "success",
      message: "Blog deleted successfully!",
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : Like a blog post.
 * @param {Object} req : The request object including params for blog ID.
 * @param {Object} res : The response object to send back the updated like count.
 * @fields : id (params)
 * @return {Object} : Updated blog with like count. {status, message, blog}
 */
const likeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.notFound({ message: "Blog not found." });
    }

    blog.likes += 1;
    await blog.save();

    return res.status(200).json({
      status: "success",
      message: "Blog liked successfully!",
      blog,
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : Add a comment to a blog post.
 * @param {Object} req : The request object including params for blog ID and body for user ID and comment text.
 * @param {Object} res : The response object to send back the updated blog with comments.
 * @fields : id (params), userId, commentText
 * @return {Object} : Updated blog with new comment. {status, message, blog}
 */
const addComment = async (req, res, next) => {
  try {
    const { userId, commentText } = req.body;

    if (!userId || !commentText) {
      return res.badRequest({ message: "User ID and comment text are required." });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.notFound({ message: "Blog not found." });
    }

    blog.comments.push({ user: userId, commentText });
    await blog.save();

    return res.status(200).json({
      status: "success",
      message: "Comment added successfully!",
      blog,
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
};
