/**
 * index.js
 * @description :: index route of platforms
 */

const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { healthcheck } = require("../controller/healthCkeck");
const { signUp, loginAdmin } = require("../controller/auth/adminAuthController");
const { createEmployee, getAllEmployees, updateEmployee, deleteEmployee } = require("../controller/Employee_Controller");
const { checkAuthenticate } = require("../middleware/adminAuthenticate");
// const HeaderKey = require("../middleware/headerKey");

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

// ======================== || Auth Routes || ====================================

router.route('/admin/signup').post(signUp)
router.route('/admin/login').post(loginAdmin)

// ====================== || Employee Routes || ==========================
router.route('/employee/add').post(checkAuthenticate, createEmployee)
router.route('/employees').get(getAllEmployees)
router.route('/employees/:id').put(checkAuthenticate, updateEmployee)
router.route('/employees/:id').delete(checkAuthenticate, deleteEmployee)



module.exports = router;
