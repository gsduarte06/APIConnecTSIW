const express = require("express");
const router = express.Router();


// import controller middleware
const usersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");
router.route("/")
  .get(usersController.findAll)
  .post(usersController.bodyValidator, usersController.create)
  
router.route("/:id")
  .get(usersController.findOne)
  .patch(authController.tokenVal, usersController.update)

  router.route("/:id/backgrounds")
  .get(authController.tokenVal,usersController.findBackground)
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
