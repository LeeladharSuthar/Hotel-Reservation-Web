import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from "path"
import verifyJWT from './middlewares/auth.middleware.js'
const app = express()

// CORS_ORIGIN should be address of frontend where it is hosted
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//  for parsing JSON data sent in the req.body 
//  i.e,. converting a JSON (JavaScript Object Notation) string into a JavaScript object
app.use(express.json({ limit: "16kb" }))

// parse incoming request bodies that are formatted in URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

// for serving Static files
app.use(express.static("public"))

// for handling browser's cookies
app.use(cookieParser())

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', "./views/");
// Routes import

import userRouter from "./routes/user.routes.js"
import reservationRouter from "./routes/reservation.routes.js"
import restaurantRouter from "./routes/restaurant.route.js"
import { Reservation } from './models/reservation.model.js'
import { Restaurant } from './models/restaurant.model.js'
// Routes declarations
app.use("/api/v1/users", userRouter)
app.use("/api/v1/reservation", reservationRouter)
app.use("/api/v1/restaurant", restaurantRouter)


app.get("/", verifyJWT, (req, res) => {

    res.render('index', { "data": req.user })
})
app.get("/reservations", verifyJWT, (req, res) => {

    res.render('reservations', { "data": req.user })
})
app.get("/restaurant", verifyJWT, (req, res) => {

    res.render('restaurant', { "data": req.user })
})
app.get("/login", verifyJWT, (req, res) => {

    res.render('login', { "data": req.user })
})
app.get("/register", verifyJWT, (req, res) => {

    res.render('register', { "data": req.user })
})
app.get('/profile', verifyJWT, (req, res) => {
    res.render('profile', { "data": req.user })
})
app.get('/myreservations', verifyJWT, async (req, res) => {

    const data = await Reservation.aggregate([
        {
            $match: {
                orderedBy: req.user._id
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    res.render('myreservation', { "dataOne": data, "data": req.user })
})
app.get('/myBookings', verifyJWT, async (req, res) => {
    try {
        const data = await Restaurant.aggregate([
            {
                $match: {
                    orderedBy: req.user._id
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);


        res.render('mybookings', { data: req.user, dataOne: data });
    } catch (error) {
        res.render('error')
    }
});
export { app }