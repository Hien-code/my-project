const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/product.controller");

router.get("/", controller.index);

//Used to export(xuất) the router variable from the current module (file), so that other files can require() and use it.
module.exports = router;
