import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { Reservation } from "../models/reservation.model.js"
const { ObjectId } = mongoose.Types;
import { Restaurant } from "../models/restaurant.model.js"

const createRestaurant = asyncHandler(async (req, res) => {
    const { name, mainCourse, drink, side } = req.body

    const prices = {
        mainCourse: {
            '#': 0,
            steak: 180,
            chicken: 120,
            fish: 90,
            pasta: 80
        },
        side: {
            '#': 0,
            fries: 35,
            salad: 30,
            rice: 60,
            soup: 30
        },
        drink: {
            '#': 0,
            water: 20,
            soda: 40,
            beer: 100,
            lemonade: 80
        }
    };

    function calculateBillAmount(mainCourse, side, drink) {
        let amount = 0;

        if (mainCourse && prices.mainCourse[mainCourse.toLowerCase()]) {
            amount += prices.mainCourse[mainCourse.toLowerCase()];
        }

        if (side && prices.side[side.toLowerCase()]) {
            amount += prices.side[side.toLowerCase()];
        }

        if (drink && prices.drink[drink.toLowerCase()]) {
            amount += prices.drink[drink.toLowerCase()];
        }

        return amount;
    }

    const amount = calculateBillAmount(mainCourse, side, drink);

    const restaurantStatus = await Restaurant.create({
        name, 
        mainCourse: (mainCourse=='#'? ' ': mainCourse),
        drink: (drink=='#'? ' ': drink),
        side: (side=='#'? ' ': side),
        orderedBy: req.user._id,
        amount
    });

    res.render('index', { data: req.user })
})

export { createRestaurant }