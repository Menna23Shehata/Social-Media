const globalErrorHandler = (err, req, res, next) => {
    res.status(err.statusCode).json({ Error : err.message })
}

export default globalErrorHandler