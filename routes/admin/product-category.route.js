const express = require("express");
const router = express.Router();
const multer = require("multer");

//Updata name photo
const upload = multer();
const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validates/admin/product-category.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/detail/:id", controller.detail);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.get("/edit/:id", controller.edit);

router.delete("/delete-hard/:id", controller.hardDelete);

router.patch("/restore/:id", controller.restore);

router.get("/trash", controller.trash);

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.patch("/change-multi", controller.changeMulti);

module.exports = router;
