import globalErrorHandler from "../utils/middleware/globalErrorHandler.js";
import AppError from "../utils/services/AppError.js";
import authRoutes from "./auth/auth.routes.js";
import postRouter from "./posts/posts.routes.js";
import userRoutes from "./users/users.routes.js";



export function allRoutes(app) {
    app.use('/api/v1/user', userRoutes)
    app.use('/api/v1/post', postRouter)
    app.use('/api/v1/auth', authRoutes)



    app.all("*", (req, res, next) => {
        next(new AppError(`can't find this route ${req.originalUrl}`, 404))
    })

    app.use(globalErrorHandler)
}