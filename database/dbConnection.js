import mongoose from "mongoose";

export function dbConnection() {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log("DB Connected"))
        .catch((err) => console.log("Error Connecting DB", err))
}