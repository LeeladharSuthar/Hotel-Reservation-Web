import { Router } from "express"
import { registerUser, loginUser, logoutUser, verifyLoginCredentials, verifyRegister } from "../controllers/user.controller.js"
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

export default router