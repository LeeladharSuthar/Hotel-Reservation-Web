import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { Reservation } from "../models/reservation.model.js"
const { ObjectId } = mongoose.Types;


const makeReservation = asyncHandler(async (req, res) => {
    let { name, guests, arrival, departure, room, mail } = req.body

    function calculateAmountForReservation(guests, arrival, departure, room) {
        const roomRates = {
            single: 1000, // Cost per night for a single room
            duplex: 1500, // Cost per night for a double room
        };

        // Parse the arrival and departure dates
        const arrivalDate = new Date(arrival);
        const departureDate = new Date(departure);
        // Calculate the number of nights
        const timeDifference = departureDate - arrivalDate;
        const numberOfNights = timeDifference / (1000 * 60 * 60 * 24);

        // Get the cost per night for the specified room type
        const costPerNight = roomRates[room];

        // Calculate the total amount
        const totalAmount = numberOfNights * costPerNight;

        return totalAmount;
    }

    const total = calculateAmountForReservation(guests, arrival, departure, room)
    
    const reservationStatus = await Reservation.create({
        fullname: name,
        email: mail,
        noOfGuests: guests,
        arrivalDate: arrival,
        departureDate: departure,
        room: room,
        amount: total,
        orderedBy: req.user._id
    })


    res.render('index', { data: req.user })
})

const cancelReservation = asyncHandler(async (req, res) => {

})

const listReservations = asyncHandler(async (req, res) => {

})

export { makeReservation, cancelReservation, listReservations }