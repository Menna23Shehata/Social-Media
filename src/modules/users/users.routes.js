import express from 'express'
import * as userController from './users.controller.js'
import { uploadSingleFile } from '../../utils/middleware/fileUploader.js'
import { changePasswordSchema, resetPasswordSchema, signUpSchema, updateUserSchema } from './user.validaion.js'
import { validation } from '../../utils/middleware/validation.js'
import { protectedRoutes } from '../auth/auth.controller.js'
import postRouter from '../posts/posts.routes.js'

const userRoutes = express.Router()
userRoutes.use('/:id/post', postRouter)

userRoutes.post('/signup', uploadSingleFile('profilePic', 'profilePic'), validation(signUpSchema), userController.signUp)

userRoutes.get('/', userController.getAllUsers)

userRoutes.route("/:id")
    .get(userController.getUserById)
    .delete(protectedRoutes, userController.deleteUser)
    .put(uploadSingleFile('profilePic', 'profilePic'),validation(updateUserSchema), protectedRoutes, userController.updateUser)

userRoutes.patch("/changePassword/:id", validation(changePasswordSchema), protectedRoutes, userController.changePassword);

userRoutes.patch("/forgetPassword/:t", userController.forgetPassword)

userRoutes.patch("/resetPassword/:token", validation(resetPasswordSchema),protectedRoutes, userController.resetPassword) // protected

export default userRoutes