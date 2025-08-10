const express = require("express");

//định nghĩa các tuyến đường (route)
const router = express.Router();
const controller = require("../../controllers/admin/auth.controller");
const validate = require("../../validates/admin/auth.validate");

router.get("/login", controller.login);

router.post("/login", validate.loginPost, controller.loginPost);

module.exports = router;
