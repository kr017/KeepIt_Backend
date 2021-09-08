var express = require("express");
var router = express.Router();
const UserController = require("../controller/user");
//user apis
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.post("/checkMail", UserController.checkMail);
router.post("/import", UserController.importProducts);
module.exports = router;
