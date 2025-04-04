
const express = require("express");
const { signUp,  loginUser } = require("../../../controller/auth/userAuthController");


const router = express.Router();
// ======================== || Auth Routes || ====================================

router.post("/user/signup", signUp);
router.post("/user/login", loginUser)

module.exports = router;
