const express = require("express");
const { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog, 
  likeBlog, 
  addComment 
} = require("../../../controller/blogsController");
const upload = require("../../../middleware/uploadOnCloudinaryMiddleware");
const { checkUserAuthenticate } = require("../../../middleware/Authenticate");

const router = express.Router();

// ======================== || Blog Routes || ====================================

router.post("/blog/create",  upload.single("image"), createBlog);
router.get("/blogs", getAllBlogs); 
router.get("/blog/:id", getBlogById); 
router.put("/blog/update/:id", upload.single("image"), updateBlog);
router.delete("/blog/delete/:id", deleteBlog); 
router.post("/blog/like/:id", likeBlog); 
router.post("/blog/comment/:id", addComment); 


module.exports = router;
