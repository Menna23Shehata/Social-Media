import express from 'express';
import * as postController from './posts.controller.js'
import { protectedRoutes } from '../auth/auth.controller.js';
import { validation } from '../../utils/middleware/validation.js';
import { comentSchema, createPostSchema, likesAndDislikesSchema } from './posts.validation.js';
import { uploadMixedFiles } from '../../utils/middleware/fileUploader.js';

const postRouter = express.Router({ mergeParams: true });

postRouter.route("/")
    .post(uploadMixedFiles("posts", [{ name: "images", maxCount: 8 }]), validation(createPostSchema), protectedRoutes, postController.createPost)
    .get(postController.getPostByUserId)

postRouter.get('/allPosts', postController.getAllPosts);


postRouter.route('/:id')
    .delete(protectedRoutes, postController.deletePost)
    .put(uploadMixedFiles("posts", [{ name: "images", maxCount: 8 }]),protectedRoutes, postController.updatePost)

postRouter.post('/like', validation(likesAndDislikesSchema), protectedRoutes, postController.likes)
postRouter.post('/dislike', validation(likesAndDislikesSchema), protectedRoutes, postController.disLikes)
postRouter.post('/comment', validation(comentSchema), protectedRoutes, postController.comments)

export default postRouter;