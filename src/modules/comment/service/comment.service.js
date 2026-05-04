import * as dbService from '../../../DB/db.service.js'
import { postmodel } from '../../../DB/model/post.model.js';
import { Commentmodel } from '../../../DB/model/comment.model.js';
import { asyncHandler } from "../../../utilies/error.Response.js";
import { cloud } from '../../../utilies/multer/cloudinary.multer.js';
import { successResponse } from "../../../utilies/success.response.js";
import { model } from 'mongoose';
import { roleTypes } from '../../../DB/model/User.model.js';

export const createComment = asyncHandler(async (req, res, next) => {
    const { postId , commentId } = req.params;
    if (commentId && !(await dbService.findOne({
        model: Commentmodel,
        filter: { _id: commentId, postId, isDeleted: { $exists: false } }
    }))) {
        return next(new Error("Invalid parent comment"));
    }



    const post = await dbService.findOne({
      model: postmodel,
      filter: { _id: postId, isDeleted: { $exists: false } }
    });
    
    if (!post) {
      return next(new Error('In-valid post Id', { cause: 404 }));
    }
    
    if (req.files?.length) {
      const attachments = [];
      for (const file of req.files) {
        const { secure_url, public_id } = await cloud.uploader.upload(file.path, {
          folder: `${process.env.APP_NAME}/user/${post.createdBy}/post/${postId}/comment`
        });
    
        attachments.push({ secure_url, public_id });
      }
      req.body.attachments = attachments;
    }
    
    const comment = await dbService.create({
      model: Commentmodel,
      data:{
        ...req.body,
        commentId,
        postId,
        createdBy:req.user._id
      }
    });
    await dbService.updateOne({
        model:postmodel , filter:{_id:post} , data:{
            $addToSet:{comment:comment._id}
        }

    })
    return successResponse({ res, status: 201 , data :{ comment } });
});

export const updateComment = asyncHandler(async (req, res, next) => {
    const { postId, commentId } = req.params;
    const comment = await dbService.findOne({
        model: commentModel,
        filter: {
            _id: commentId,
            postId,
            createdBy: req.user_id,
            isDeleted: { $exists: false }
        },
        populate: {
            path: "postId"
        }
    });

    if (!comment || comment.postId.isDeleted) {
        return next(new Error('Invalid comment Id', { cause: 404 }));
    }
    if (req.files?.length) {
        const attachments = [];
        for (const file of req.files) {
          const { secure_url, public_id } = await cloud.uploader.upload(file.path, {
            folder: `${process.env.APP_NAME}/user/${post.createdBy}/post/${postId}/comment`
          });
      
          attachments.push({ secure_url, public_id });
        }
        req.body.attachments = attachments;
      }
      const savedcomment= await dbService.findByIdAndUpdate({
        model:Commentmodel,
        filter:{
            _id:commentId,
            postId,
            createdBy: req.user_id,
            isDeleted: { $exists: false }
        },
        data:{
            ...req.body,
        }

      });
      return successResponse({ res, status: 201 , data :{ comment : savedcomment } });
});

export const freezeComment = asyncHandler(async (req, res, next) => {
    const { postId, commentId } = req.params;
    const comment = await dbService.findOne({
        model: commentModel,
        filter: {
            _id: commentId,
            postId,
            isDeleted: { $exists: false }
        },
        populate: {
            path: "postId"
        }
    });

    if (
        !comment
        ||
       ( comment.createdBy.toString() != req.user._id.toString()
        &&
        comment.postId.createdBy.toString() != req.user._id.toString()
        &&
        req.user.role != roleTypes.admin)
    ) {
        return next(new Error('Invalid comment Id', { cause: 404 }));
    }
 
      const savedcomment= await dbService.findByIdAndUpdate({
        model:Commentmodel,
        filter:{
            _id:commentId,
            postId,
            isDeleted:Date.now(),
            deletedBy:req.user._id
        },
        data:{
            ...req.body,
        }

      });
      return successResponse({ res, status: 201 , data :{ comment : savedcomment } });
});

export const unfreezeComment = asyncHandler(async (req, res, next) => {
    const { postId, commentId } = req.params;
   
      const savedcomment= await dbService.findByIdAndUpdate({
        model:Commentmodel,
        filter:{
            _id:commentId,
            postId,
            isDeleted:{$exists : true},
            deletedBy:req.user._id
        },
        data:{
            $unset:{
                isDeleted:0,
                deletedBy:0
            },
            updateBy:req.user._id
        }

      });
      return successResponse({ res, status: 201 , data :{ comment : savedcomment } });
});
        
      
