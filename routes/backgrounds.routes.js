const express = require("express");
const router = express.Router();


// import controller middleware
const backgroundsController = require("../controllers/backgrounds.controller");
const authController = require("../controllers/auth.controller");


 
  

  router.route("/:id")
  .patch(authController.tokenVal, backgroundsController.update)
  .delete(authController.tokenVal,backgroundsController.delete)



router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" }); //send a predefined error message
});
//export this router
module.exports = router;
