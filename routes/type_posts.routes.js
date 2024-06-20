const express = require("express");
const router = express.Router();


// import controller middleware
const type_postsController = require("../controllers/type_posts.controller");
const authController = require("../controllers/auth.controller");
  
router.route("/")
  .get(type_postsController.get)

router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" }); //send a predefined error message
});
//export this router
module.exports = router;
