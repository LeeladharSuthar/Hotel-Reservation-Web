import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // extract token
        // either the server can get accessToken from cookies or client needs to send accessToken in header with {"Authorization": "Bearer accessToken"}
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            req.user = null
            return next()
        }
        const data = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // get user document
        const user = await User.findById(data?._id).select("-password -refreshToken")

        // verify user
        if (!user) {
            req.user = null
        } else {
            // append user to req and call next()
            req.user = user
        }
        
        return next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})

export default verifyJWT