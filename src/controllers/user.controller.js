import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudnary } from "../utils/cloudnary.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken;
        const res = await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}

const verifyRegister = asyncHandler(async (req, res) => {
    const { username, email, phone } = req.body

    // Check if user already exists in db
    const existedUserEmail = await User.findOne({ "email": email })
    if (existedUserEmail) {
        return res.status(200).json({ message: 'Email already registered', code: 400 })
    }
    const existedUserName = await User.findOne({ "username": username })
    if (existedUserName) {
        return res.status(200).json({ message: 'Username not available', code: 401 })
    }
    const existedUserPhone = await User.findOne({ "phone": phone })
    if (existedUserPhone) {
        return res.status(200).json({ message: 'Phone number already registered', code: 402 })
    }

    return res.status(200).json({ message: 'OK', code: 200 })
})

const registerUser = asyncHandler(async (req, res) => {
    // get user details
    const { username, email, fullname, password, phone } = req.body

    const localAvatarPath = req.files?.avatar?.[0].path;

    // Upload images on cloudnary

    let avatar = await uploadOnCloudnary(localAvatarPath)

    // save in db
    avatar = !avatar ? "" : avatar.url
    const user = await User.create({
        fullname,
        avatar: avatar,
        username: username.toLowerCase(),
        password,
        email,
        phone
    })

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // send tokens through cookies and send the response
    const data = await User.findById(user._id).select("-password")

    const options = { // makes cookies secure. i.e., only server can modify them
        httpOnly: true,
        secure: true
    }

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return res.status(200).render('index', { data })

})

const verifyLoginCredentials = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // validate the data

    if (!email) {

        return res.status(200).json({ message: 'Email required', code: 400 })
    }
    if (!password) {
        return res.status(200).json({ message: 'Password required', code: 401 })
    }

    // find the user
    const user = await User.findOne({ "email": email })

    // if no user send APiError
    if (!user) {
        return res.status(200).json({ message: 'User does not exist', code: 402 })
    }

    // else password check
    const isPasswordValid = await user.isPasswordCorrect(password) // returns boolean
    if (!isPasswordValid) {
        return res.status(200).json({ message: 'Incorrect Password', code: 403 })
    }
    return res.status(200).json({ message: 'OK', code: 200 })

})

const loginUser = asyncHandler(async (req, res) => {
    // get data
    const { email, password } = req.body

    const user = await User.findOne({ "email": email })

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // send tokens through cookies and send the response
    const data = await User.findById(user._id).select("-password")

    const options = { // makes cookies secure. i.e., only server can modify them
        httpOnly: true,
        secure: true
    }

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return res.status(200).render('index', { data })
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } })
    const options = { // makes cookies secure. i.e., only server can modify them
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .render("index", { data: null })
})

export {
    registerUser, loginUser, logoutUser,
    verifyLoginCredentials,
    verifyRegister,
}