import Joi from 'joi'

export const signUpSchema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().min(2).required(),
    password: Joi.string().min(6).required().max(10)
})

export const updateUserSchema = Joi.object({
    name: Joi.string().min(6).required().max(10),
    email: Joi.string().email().min(2).required(),
    id: Joi.string().hex().length(24).required()
})


export const changePasswordSchema = Joi.object({
    oldPass: Joi.string().min(6).required().max(10),
    newPass: Joi.string().min(6).required().max(10),
    rePass: Joi.valid(Joi.ref('newPass')).required()
})

export const resetPasswordSchema = Joi.object({
    newPass: Joi.string().min(6).required().max(10),
    token: Joi.string()
})