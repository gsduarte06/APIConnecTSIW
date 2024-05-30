const express = require("express");
const router = express.Router();


// import controller middleware
const commentsController = require("../controllers/comments.controller");
const authController = require("../controllers/auth.controller");

router.route("/:id/likes")
  .get(commentsController.findLikes)
  .post(authController.tokenVal,commentsController.bodyValidator,commentsController.createLike)
  .delete(authController.tokenVal, commentsController.bodyValidator,commentsController.deleteLike)

  router.route("/:id")
  .delete(authController.tokenVal,commentsController.delete)

router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" }); //send a predefined error message
});
//export this router
module.exports = router;
