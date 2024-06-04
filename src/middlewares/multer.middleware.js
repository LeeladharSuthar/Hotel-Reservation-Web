import multer from "multer"
import path from "path"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // Extract original extension
        cb(null, file.fieldname + Date.now() + ext); // Combine field name and original extension
        // console.log(file)
    }
})

export const upload = multer({ storage: storage })