/**
 * index.js
 * @description :: index route of platforms
 */

const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { healthcheck } = require("../controller/healthCkeck");
const { checkAuthenticate } = require("../middleware/adminAuthenticate");
// const HeaderKey = require("../middleware/headerKey");
const adminRoutes = require("./device/v1/adminRoutes");

const userRoutes = require("./device/v1/userRoutes")
const blogsRoutes = require("./device/v1/blogRoutes")

const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  // max: 10,
  max: 1000,
  message: "Rate limit exceeded, please try again after 10 minutes",
  skip: (req) => {
    if (req.url.includes("/swagger") || req.url.includes("/favicon")) {
      return true;
    } else {
      return false;
    }
  },
});

const deviceRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  // max: 10,
  max: 1000,
  message: "Rate limit exceeded, please try again after 5 minutes",
  skip: (req) => {
    if (req.url.includes("/swagger") || req.url.includes("/favicon")) {
      return true;
    } else {
      return false;
    }
  },
});


router.use(require("./device/v1/index"));

router.route('/healthcheck').get(healthcheck)

// ======================== ||  Routes || ====================================
router.use(adminRoutes);

router.use(userRoutes);
router.use(blogsRoutes);

// ====================== || Routes || ==========================


module.exports = router;
