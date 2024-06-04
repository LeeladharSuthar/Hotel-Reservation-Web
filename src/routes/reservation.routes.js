import { Router } from "express"
import verifyJWT from "../middlewares/auth.middleware.js"
import {  makeReservation } from "../controllers/reservation.controller.js"

const router = Router()

router.route("/makeReservation").post(verifyJWT, makeReservation)

export default router