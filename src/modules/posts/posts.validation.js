import Joi from 'joi'

export const createPostSchema = Joi.object({
    title: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(2),
    postedBy: Joi.string().hex().length(24).required(),
    status: Joi.string().max(7)
})


export const likesAndDislikesSchema = Joi.object({
    postId: Joi.string().hex().length(24).required()
})

export const comentSchema = Joi.object({
    text: Joi.string().required(),
    postId: Joi.string().hex().length(24).required()
})