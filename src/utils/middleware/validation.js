export const validation = (schema) => {
    return (req, res, next) => {
        let inputs = { ...req.params, ...req.body, ...req.query }
        let { error } = schema.validate(inputs, { abortEarly: false })
        if (error) {
            let errors = error.details.map((detail) => detail.message)
            res.json(errors)
        } else {
            next()
        }

    }
}