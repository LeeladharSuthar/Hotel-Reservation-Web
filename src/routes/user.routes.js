import { Router } from "express"
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateUser, updateAvatar, updateCoverImage, getUserChannelProfile, watchHistory, verifyLoginCredentials, verifyRegister } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import verifyJWT from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([{
        name: "avatar",
        maxCount: 1
    }]),
    registerUser
)
router.route("/verifyRegister").post(verifyRegister)
 
router.route("/login").post(loginUser)
router.route("/verifyLogin").post(verifyLoginCredentials)

router.route("/logout").get(verifyJWT, logoutUser)

router.route("/refreshAccessToken").post(refreshAccessToken)

// router.route("/changePassword").post(verifyJWT, changeCurrentPassword)

// router.route("/updateUser").patch(verifyJWT, updateUser)

export default router