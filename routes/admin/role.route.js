const express = require("express");

const router = express.Router();

const controller = require("../../controllers/admin/role.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", controller.editPatch);

router.delete("/delete/:id", controller.deleteItem);

router.delete("/delete-hard/:id", controller.deleteHard);

router.patch("/restore/:id", controller.restore);

router.get("/trash", controller.trash);

module.exports = router;
