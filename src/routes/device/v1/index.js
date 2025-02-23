


/**
 * index.js
 * @description :: index route file of admin platform.
 */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    data: "Server is running",
  });
});

// router.use(require("./adminRoutes"));


module.exports = router;