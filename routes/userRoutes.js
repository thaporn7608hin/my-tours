const express = require("express")
const userController = require("./../controller/userController")
const authCotroller = require("../controller/authController")

const router = express.Router()

router.post("/signup",authCotroller.singup)
router.post("/login",authCotroller.login)
router.get("/logout",authCotroller.logout)
router.post("/forgotPassword",authCotroller.forgotPassword)
router.patch("/resetPassword/:token",authCotroller.resetPassword) 

router.use(authCotroller.protect) 

router.get("/me",userController.getMe,userController.getUser)
router.patch("/updateUser",userController.uploadPhoto,userController.resizePhoto,userController.updateMe) 
router.patch("/updatePassword", authCotroller.updatePassword)
router.delete("/deleteMe",userController.deleteMe)

router.use(authCotroller.restrictTo("admin","user"))

router
    .route("/")
    .get(userController.getAllUser)

router
    .route("/:id")
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser)



module.exports = router