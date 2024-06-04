import mongoose from "mongoose";

const RestaurantSchema = mongoose.Schema({
    
    orderedBy: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    name: {
        type: String,
        required: true
    },
    mainCourse: {
        type: String,
        required: true
    },
    drink:{
        type: String,
        required: true
    },
    side: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }

}, { timestamps: true })

export const Restaurant = new mongoose.model("Restaurant", RestaurantSchema)