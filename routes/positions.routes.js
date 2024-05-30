const express = require("express");
const router = express.Router();


// import controller middleware
const positionsController = require("../controllers/positions.controller");
const authController = require("../controllers/auth.controller");
  
router.route("/")
  .get(authController.tokenVal,positionsController.get)
  .post(authController.tokenVal,positionsController.create)


router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" }); //send a predefined error message
});
//export this router
module.exports = router;
