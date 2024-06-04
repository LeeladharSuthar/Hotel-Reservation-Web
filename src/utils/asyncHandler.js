// asyncHandler is a higher-order function because it takes a function (fun) as its argument and returns another function that serves as middleware for Express.js routes.
const asyncHandler = (fun) => async (req, res, next) => {
    try {
        await fun(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

export { asyncHandler }




// const asyncHandler = (fun) => {
//     return (req, res, next) => {
//         Promise.
//             resolve(fun(req, res, next)).
//             catch((error) => next(error))
//     }
// }