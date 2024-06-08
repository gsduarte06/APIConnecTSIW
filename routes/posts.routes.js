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

const upload = multer({ storage }).single("image");


// import controller middleware
const postsController = require("../controllers/posts.controller");
const authController = require("../controllers/auth.controller");
router.route("/")
  .get(postsController.find)
  .post(authController.tokenVal,authController.isAdmin,upload,postsController.bodyValidator, postsController.create)
  

  router.route("/:id")
  .delete(authController.tokenVal,authController.isAdmin,postsController.delete)

  router.route("/:id/comments")
  .get(postsController.findComments)
  .post(authController.tokenVal, postsController.createComment)

  router.route("/:id/likes")
  .get(postsController.findLikes)
  .post(authController.tokenVal,postsController.bodyValidatorLikes,postsController.createLikes)
  .delete(authController.tokenVal, postsController.bodyValidatorLikes,postsController.deleteLikes)


  router.route("/:id/present_users")
  .get(postsController.findPresentUsers)
  .post(authController.tokenVal,postsController.bodyValidatorPresence,postsController.createPresence)
  .delete(authController.tokenVal, postsController.bodyValidatorPresence,postsController.deletePresence)

router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" }); //send a predefined error message
});
//export this router
module.exports = router;
