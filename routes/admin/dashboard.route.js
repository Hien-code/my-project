//import thư viện Express vào biến express
const express = require("express");

//định nghĩa các tuyến đường (route)
const router = express.Router();
const controller = require("../../controllers/admin/dashboard.controller");

router.get("/", controller.dashboard);

module.exports = router;
