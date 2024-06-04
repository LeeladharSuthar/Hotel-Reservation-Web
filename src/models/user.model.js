import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        // The index: true option in Mongoose is used to create an index on the specified field in MongoD
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        // Url of avatar image uploaded on Cloudnary
        type: String,
    },
    password: {
        type: String,
        requires: [true, 'Password is Required']
    },
    phone:{
        type: String
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})

UserSchema.pre("save", async function (next) {
    if (this.isModified("password"))
        this.password = await bcrypt.hash(this.password, 10)
    next()
})


// To use the isPasswordCorrect method, you would first need to retrieve the document (user) from the database, store it in a variable, and then call isPasswordCorrect on that variable.
// const user = await User.findOne({ username: "exampleUser" }); // Retrieve user from the database
// const isCorrect = await user.isPasswordCorrect("hello");
UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = async function () {
    return await jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", UserSchema)