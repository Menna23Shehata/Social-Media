import { postModel } from "../../../database/models/post.model.js";
import catchAsyncError from "../../utils/middleware/catchAsyncError.js";
import AppError from "../../utils/services/AppError.js";
import { deleteOne } from "../../utils/handlers/refactor.handler.js";
import ApiFeatures from "../../utils/APIFeatures.js";


const createPost = catchAsyncError(async (req, res, next) => {
    try {
        req.body.images = req.files.images.map(ele => ele.filename)
        let results = new postModel(req.body);
        await results.save();
        res.status(201).json({ message: "Success", results });
    } catch (error) {
        next(new AppError(`something went wrong, ${error}`, 400))
    }
});


const getPostByUserId = catchAsyncError(async (req, res, next) => {
    let userPosts = await postModel.find({ postedBy: req.params.id, status: 'public' })
    if (!userPosts) return next(new AppError("THIS USER'S POSTS ARE PRIVATE", 404))
    res.json({ message: "Success", userPosts })
});

const getAllPosts = catchAsyncError(async (req, res, next) => {
    let apiFeature = new ApiFeatures(postModel.find({ status: 'public' }), req.query).pagination().sort().search().fields();
    let results = await apiFeature.mongooseQuery;
    res.status(201).json({ message: "Success", results });
});

const updatePost = catchAsyncError(async (req, res, next) => {
    try {
        let { id } = req.params; // id Post 
        // userid .... req.user._id
        // console.log(req.files);
        if (req.files) req.body.images = req.files.images.map(ele => ele.filename);
        let results = await postModel.findOneAndUpdate({ _id: id, postedBy: req.user._id }, req.body, { new: true });
        !results && next(new AppError("not found Post", 404));
        results && res.json({ message: "Success", results });
    } catch (error) {
        next(new AppError(`something went wrong, ${error}`, 400))
    }
});

const deletePost = deleteOne(postModel)

const likes = async (req, res, next) => {
    try {
        let x = await postModel.findByIdAndUpdate(req.body.postId,
            {
                $addToSet: { likes: req.user._id }
            },
            { new: true })

        x.save()
        res.json({ message: "Success", x })

    } catch (error) {
        next(new AppError(`something went wrong, ${error}`, 400))
    }

}

const disLikes = async (req, res, next) => {
    try {
        let x = await postModel.findByIdAndUpdate(req.body.postId,
            {
                $pull: { likes: req.user._id }
            },
            { new: true })

        x.save()
        res.json({ message: "Success", x })

    } catch (error) {
        next(new AppError(`something went wrong, ${error}`, 400))
    }
}

const comments = async (req, res, next) => {
    try {
        const comment = {
            text: req.body.text,
            commentedBy: req.user._id
        }
        let x = await postModel.findByIdAndUpdate(req.body.postId,
            {
                $push: { comments: comment }
            },
            { new: true })

        x.save()
        res.json({ message: "Success", x })

    } catch (error) {
        next(new AppError(`something went wrong, ${error}`, 400))
    }

}

export {
    createPost,
    getAllPosts,
    getPostByUserId,
    updatePost,
    deletePost,
    likes, disLikes, comments
}