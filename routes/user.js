const express = require("express");
const UserController = require("../controllers/UsersController");

let router = express.Router();
router.use(express.json());

router.post("/addUser", UserController.addNewUser);
router.post("/signIn", UserController.login);
router.get("/confirmation/:email/", UserController.activateAccount);
router.patch("/resetPass/:email/", UserController.ResetPassword);
router.get("/getAllUsers",UserController.getAllUsers)
router.get("/getOneUser/:id",UserController.getOneUser)
router.get("/getOneUserByEmail/:email",UserController.getOneUserByEmail)
router.patch("/deleteUser/:id",UserController.deleteUser)
module.exports = router;
