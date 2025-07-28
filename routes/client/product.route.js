const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/product.controller");

router.get("/", controller.index);
router.get("/:slug", controller.detail);

//Used to export(xuất) the router variable from the current module (file), so that other files can require() and use it.
module.exports = router;
