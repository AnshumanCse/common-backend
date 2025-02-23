
const express = require("express");
const { signUp, loginAdmin } = require("../../../controller/auth/adminAuthController");


const router = express.Router();
// ======================== || Auth Routes || ====================================

router.post("/admin/signup", signUp);
router.post("/admin/login", loginAdmin)

module.exports = router;
