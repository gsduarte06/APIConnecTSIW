const express = require("express");
const router = express.Router();
require("dotenv").config();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.C_CLOUD_NAME,
  api_key: process.env.C_API_KEY,
  api_secret: process.env.C_API_SECRET,
});

let storage = multer.memoryStorage();

const upload = multer({ storage }).fields([{name: "image", maxCount:1},{name:"pdf", maxCount:1}]);


// import controller middleware
const usersController= require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");
router.route("/")
  .get(usersController.findAll)
  .post(usersController.bodyValidator, usersController.create)
  
router.route("/:id")
  .get(usersController.findOne)
  .patch(authController.tokenVal,upload, usersController.update)
  .delete(authController.tokenVal,authController.isAdmin,usersController.delete)

  router.route("/:id/backgrounds")
  .get(usersController.findBackground)
  .post(authController.tokenVal,usersController.bodyValidatorBG, usersController.createBG)

router.route("/login")
  .post(usersController.login)

  
router.route("/:id/xp")
  .get(authController.tokenVal,usersController.getXP)

router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" }); //send a predefined error message
});
//export this router
module.exports = router;
