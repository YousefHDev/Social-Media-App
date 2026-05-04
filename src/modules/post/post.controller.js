import * as postService from './service/post.service.js';
import * as validators from './post.validation.js';
import commentcontroller from '../comment/comment.controller.js'
import { validation } from '../../middleware/validation.middleware.js';
import { authentication, authorization } from '../../middleware/auth.middleware.js';
import { endpoint } from './post.auth.js';
import { Router } from "express";
import { fileValidations,uploadCloudfile } from '../../utilies/multer/cloud.multer.js';
const router = Router();

router.use("/:postId/comment", commentcontroller);
router.post(
    "/",
    authentication(),
    postService.getPosts
);

router.post(
    "/",
    authentication(),
    authorization(endpoint.createPost),
    uploadCloudfile(fileValidations.image).array('attachment', 2),
    validation(validators.createPost),
    postService.createPost
);

router.patch(
    "/:postId",
    authentication(),
    authorization(endpoint.createPost),
    uploadCloudfile(fileValidations.image).array('attachment', 2),
    validation(validators.updatePost),
    postService.updatePost
);

router.delete(
    "/:postId",
    authentication(),
    authorization(endpoint.freezePost),
    validation(validators.freezePost),
    postService.freezePost
);

router.delete(
    "/:postId/restore",
    authentication(),
    authorization(endpoint.freezePost),
    validation(validators.unfreezePost),
    postService.unfreezePost
);

router.patch(
    "/:postId/like",
    authentication(),
    authorization(endpoint.likePost),
    validation(validators.likePost),
    postService.likePost
);



export default router;