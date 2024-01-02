import multer from "multer"
import AppError from "../services/AppError.js"

let options = (folderName) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${folderName}`)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + '-' + file.originalname)
        }
    })

    function fileFilter(req, file, cb) {

        if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
            cb(null, true)
        } else {
            cb(new AppError("invalid image or video", 400), false)
        }
    }
    return multer({ storage, fileFilter })
}

export const uploadSingleFile = (folderName, fieldName) => options(folderName).single(fieldName)

export const uploadMixedFiles = (folderName, arrayFields) => options(folderName).fields(arrayFields)