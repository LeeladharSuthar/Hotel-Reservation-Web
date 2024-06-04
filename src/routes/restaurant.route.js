import { Router } from "express"
import verifyJWT from "../middlewares/auth.middleware.js"
import { createRestaurant } from "../controllers/restaurant.controller.js"

const router = Router()

router.route("/createRestaurant").post(verifyJWT, createRestaurant)

export default router