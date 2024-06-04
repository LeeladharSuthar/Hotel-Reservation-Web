import mongoose from "mongoose";

const ReservationSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    noOfGuests: {
        type: String,
        required: true
    },
    arrivalDate: {
        type: Date,
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    orderedBy: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: true })

export const Reservation = new mongoose.model("Reservation", ReservationSchema)