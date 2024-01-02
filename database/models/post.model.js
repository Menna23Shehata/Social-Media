import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required'],
        minLength: [2, 'title is too short'],
        maxLength: [30, 'title is too long'],
        trim: true
    },
    description: {
        type: String,
        minLength: [2, 'description is too short'],
        trim: true,
    },
    images: [String],
    status: {
        type:String,
        enum: ['only me', 'public'],
        default: 'public'
    },
    comments: [{
        text: String,
        commentedBy: {
            type: mongoose.Types.ObjectId,
            ref: "user"
        }
    }],
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "user"
    }]
}, { timestamps: true })


postSchema.pre(/^find/, function () {
    this.populate('postedBy', 'name profilePic')
    this.populate("comments.commentedBy", "name profilePic")
    this.populate('likes', 'name profilePic')
    this.sort('-createdAt')
})


postSchema.post("init", (doc) => {
    if (doc.images) doc.images = doc.images.map((path) => process.env.BASE_URL + "/posts/" + path);
});

export const postModel = mongoose.model("post", postSchema)