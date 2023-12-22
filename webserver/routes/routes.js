var express = require("express");

var userController = require("../src/user/userController");
var messageController = require("../src/message/messageController");
const router = express.Router();
//User routing
router.route("/check").get(userController.checkName);
router.route("/user/login").post(userController.loginUserControllerFn);
router.route("/logout").post(userController.logoutUserControllerFn);
// router.route('/login-check').get(userController.isLogIn);
router.route("/user/create").post(userController.createUserControllerFn);
router.route("/user").get(userController.getAllUsersControllerFn);
router.route("/search").get(userController.searchUser);
router.route("/filter").get(userController.filterUser);
router.route("/get-user").get(userController.getUser);
router.route("/update-user").put(userController.updateUserControllerFn);
router.route("/save-user").post(userController.saveUserControllerFn);
router.route("/get-save-user").get(userController.getSavedUsers);
router.route("/remove-user").post(userController.removeSavedUsers);
router.route("/chat-history/:userId").get(userController.getAllChatHistory);
router.route("/recommend").get(userController.suggestUsers);
//Chat routing
router.route("/chat").post(messageController.createChat);
router.route("/chat").get(messageController.getChat);
router.route("/chatting").get(userController.getFirstUserId);
//router.route('/chat-list').get(userController.getChatList);

module.exports = router;
