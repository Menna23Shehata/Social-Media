import catchAsyncError from '../../utils/middleware/catchAsyncError.js'
import jwt from 'jsonwebtoken'
import AppError from "../../utils/services/AppError.js"
import { userModel } from '../../../database/models/user.model.js'
import bcrypt from 'bcrypt'

export const protectedRoutes = catchAsyncError(async (req, res, next) => {
    let { token } = req.headers
    if (!token) return next(new AppError('please provide token', 401))

    let decoded = jwt.verify(token, process.env.TOKEN_KEY)

    let user = await userModel.findById(decoded.userId)
    if (!user) return next(new AppError('invalid user', 404))

    if (user.isLogged == 'false') return next(new AppError('please login first', 409))

    if (user.changePasswordAt) {
        let changePasswordTime = parseInt(user.changePasswordAt.getTime() / 1000);
        if (changePasswordTime > decoded.iat) return next(new AppError("token invalid", 401));
    }

    req.user = user
    next()
})

export const signIn = catchAsyncError(async (req, res, next) => {
    let { email, password } = req.body;

    let foundUser = await userModel.findOne({ email });

    if (foundUser) {
        const matchedPassword = bcrypt.compareSync(password, foundUser.password);

        if (matchedPassword) {
            await userModel.updateOne({ _id: foundUser._id }, { isLogged: true })
            let token = jwt.sign({ name: foundUser.name, userId: foundUser._id }, process.env.TOKEN_KEY)//, { expiresIn: 60 * 60 }

            return res.status(201).json({ message: "Success", token })
        } else {
            return next(new AppError("incorrect password", 401))
        }
    } else {
        return next(new AppError("Please Register First", 401))
    }
})

export const signOut = catchAsyncError(async (req, res, next) => {
    let user = await userModel.findByIdAndUpdate(req.params.id, { isLogged: false }, { new: true })
    res.status(200).json({ message: "Signed Out", user })
})
