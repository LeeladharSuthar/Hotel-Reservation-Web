import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose"
import { Reservation } from "../models/reservation.model.js"

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

export { makeReservation }