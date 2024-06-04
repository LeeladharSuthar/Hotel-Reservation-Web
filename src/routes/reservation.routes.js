import { Router } from "express"
import verifyJWT from "../middlewares/auth.middleware.js"
import { cancelReservation, listReservations, makeReservation } from "../controllers/reservation.controller.js"

const router = Router()

router.route("/makeReservation").post(verifyJWT, makeReservation)
router.route("/cancelReservation").get(cancelReservation)
router.route("/listReservation").get(listReservations)

export default router