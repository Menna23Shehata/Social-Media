import { userModel } from "../../../database/models/user.model.js"
import AppError from "../../utils/services/AppError.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import catchAsyncError from "../../utils/middleware/catchAsyncError.js"
import { deleteOne, getAll } from "../../utils/handlers/refactor.handler.js"
import { nanoid } from "nanoid"
import { sendEmail } from "../../email/sendEmail.js"


const signUp = catchAsyncError(async (req, res, next) => {
    let userIsExist = await userModel.findOne({ email: req.body.email })
    if (userIsExist) return next(new AppError('email already exists', 409))

    req.body.profilePic = req.file.filename
    let userData = new userModel(req.body)
    await userData.save()

    res.status(201).json({ message: "Success", userData })
})

const getAllUsers = getAll(userModel)

const getUserById = catchAsyncError(async (req, res, next) => {
    try {
        let results = await userModel.findById(req.params.id);
        res.json({ message: "Success", results });

    } catch (error) {
        next(new AppError(`err ${error}`, 400))
    }
}
);

const updateUser = catchAsyncError(async (req, res, next) => {
    let { id } = req.params;
    if (req.file) req.body.profilePic = req.file.filename;
    let results = await userModel.findByIdAndUpdate(id, req.body, { new: true });
    !results && next(new AppError("not found User", 404));
    results && res.json({ message: "Success", results });
});

const deleteUser = deleteOne(userModel)

const changePassword = catchAsyncError(async (req, res, next) => {

    // postman (old pass,newpass,repass) .... findById(user)
    let user = await userModel.findById(req.params.id)
    if (!user) return next(new AppError('user not found', 404))

    // compare
    let comparePasswords = bcrypt.compareSync(req.body.oldPass, user.password)

    //true >>> u[]
    if (comparePasswords) {
        req.body.changePasswordAt = Date.now();

        let results = await userModel.findOneAndUpdate({ _id: id }, { password: req.body.newPass }, { new: true });

        !results && next(new AppError("not found User", 404));
        results && res.json({ message: "Success", results });

    } else {
        return next(new AppError("old password doesn't match the password saved in database", 401))
    }
});


const forgetPassword = catchAsyncError(async (req, res, next) => {
    let { t } = req.params
    const { email } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new AppError(" user doesn't exist ", 401));
    }

    const verificationCode = nanoid(6)

    const hash = bcrypt.hashSync(verificationCode, +process.env.SALT_ROUNDS)
    const token = jwt.sign({ email: user.email, verificationCode }, process.env.TOKEN_KEY, { expiresIn: 60 * 2 })
    const link = `${req.protocol}://${req.headers.host}/api/v1/user/resetPassword/${token}`
    const sent = await sendEmail(email, "👻 Hello ✔ Reset Password", `<a href="${link}" > Reset Your Password</a > `)
    if (!sent) {
        return next(new AppError("email doesn't exist", 404))
    }
    await userModel.updateOne({ email }, { verificationCode: hash })
    res.status(201).json({ message: "Success , change your password now 😄", link, token })

});

const resetPassword = catchAsyncError(async (req, res, next) => {

    const { token } = req.params;
    const { newPassword } = req.body

    if (!token) {
        return next(new AppError("token not exist", 401));
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY)
    if (!decoded) {
        return next(new AppError(" invalid token", 401));
    }
    const user = await userModel.findOne({ email: decoded.email })
    if (!user) {
        return next(new AppError(" user not exist ", 401));
    }
    const match = bcrypt.compareSync(decoded.code, user.code)
    if (!match) {
        return next(new AppError(" invalid token payload", 401));
    }
    const hash = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS)

    user.password = hash
    await user.save()
    res.status(201).json({ msg: "Success" })

});


export {
    signUp,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,
    changePassword,
    forgetPassword,
    resetPassword,

}
