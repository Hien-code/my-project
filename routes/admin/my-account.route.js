const express = require("express");
const router = express.Router();

//Up load photo
const multer = require("multer");
//Updata name photo
const upload = multer();
const controller = require("../../controllers/admin/my-account.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);
router.get("/edit", controller.edit);
router.patch(
  "/edit",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.editPatch
);

module.exports = router;
