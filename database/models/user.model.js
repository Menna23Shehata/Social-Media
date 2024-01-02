import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'username is required'],
        minLength: [2, 'name is too short'],
        maxLength: [30, 'name is too long'],
        trim: true
    },
    email: {
        type: String,
        unique: [true, 'email is used before'],
        required: [true, 'email is required'],
        minLength: [2, 'email is too short'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [6, 'password is too short']
    },
    profilePic: String,
    verificationCode:String,
    isLogged:{
        type:Boolean,
        default:false
    }
}, { timestamps: true })

userSchema.pre(/\b^find|save\b/g, function () {
    if(this.password){
        this.password = bcrypt.hashSync(this.password, Number(process.env.SALT_ROUNDS))
    }
})

userSchema.pre("findOneAndUpdate", function () {
    if (this._update.password) {
        this._update.password = bcrypt.hashSync(this._update.password, Number(process.env.SALT_ROUNDS))
    }
})


userSchema.post('init', (doc) => {
    doc.profilePic = process.env.BASE_URL + `/profilePic/` + doc.profilePic
})

export const userModel = mongoose.model("user", userSchema)