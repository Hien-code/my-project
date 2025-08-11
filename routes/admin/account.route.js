const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();

const controller = require("../../controllers/admin/account.controller");
const validate = require("../../validates/admin/account.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPatch,
  controller.editPatch
);

router.delete("/delete/:id", controller.deleteItem);

router.get("/trash", controller.trash);

router.patch("/restore/:id", controller.restore);

router.delete("/delete-hard/:id", controller.hardDelete);

module.exports = router;
