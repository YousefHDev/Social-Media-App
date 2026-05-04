import { cloud } from "../../../utilies/multer/cloudinary.multer.js";
import { asyncHandler } from "../../../utilies/error.Response.js";
import * as dbService from "../../../DB/db.service.js";
import { successResponse } from "../../../utilies/success.response.js";
import { postmodel } from "../../../DB/model/post.model.js";
import { roleTypes } from "../../../DB/model/User.model.js";
import { paginate } from "../../../utilies/pagination.js";

export const getPosts = asyncHandler(async (req, res, next) => {
    let { page, size } = req.query;
  
    const data = await paginate({
      page, size, model: postModel,
      filter: {
        isDeleted: { $exists: false }
      },
      populate: [{
        path: 'comments',
        match: { isDeleted: { $exists: false }, commentId: { $exists: false } },
        populate: [{
          path: "reply",
          match: { isDeleted: { $exists: false } },
        }],
      }],
    });
  
    return successResponse({ res, status: 200, data });
  });
      
//     let {page , size} = req.query;
//     const data = await paginate({})
//     const posts = await dbService.find({
//         model: postmodel,
//         filter: {
//             isDeleted:{$exists : false}
//         },
//         populate: [
//             {
//                 path: 'comments',
//                 match:{isDeleted:{$exists : false} , commentId:{$exists : false}},
//                 populate:[{
//                     path:'reply',
//                     match:{isDeleted:{$exists : false}}

//             }]
            
//             },
           
//         ],
//         skip,
//         limit : size
//     });
//     for (const post of posts) {
//         const comments = await dbService.find({
//             model: commentModel,
//             filter: { postId: post._id, isDeleted: { $exists: false } }
//         });
//         results.push({ post, comments });
//     }
    
//     return successResponse({ res, status: 200, data: results });
// });

export const createPost = asyncHandler(async (req, res, next) => {
    const { content } = req.body;
    let attachments = [];

    for (const file of req.files) {
        const { secure_url, public_id } = await cloud.uploader.upload(file.path);
        attachments.push({ secure_url, public_id });
    }

    const post = await dbService.create({
        model: postmodel,
        data: {
            content,
            attachments,
            createdBy: req.user._id 
        }
    });

    return successResponse({res , status:201 , data:{post}})
});

export const updatePost = asyncHandler(async (req, res, next) => {
    let attachments = [];
    if (req.files.length) {
        for (const file of req.files) {
            const { secure_url, public_id } = await cloud.uploader.upload(file.path);
            attachments.push({ secure_url, public_id });
        }
        req.body.attachments = attachments
    
        
    }

   
    const post = await dbService.findByIdAndUpdate({
        model: postmodel,
        filter :{_id:req.params.postId , createdBy:req.user._id , isDeleted:false},
        data: {
            ...req.body,
            updateBy: req.user._id 
        },
        options:{
            new:true
        }
    });

    return post? successResponse({res , status:200 , data:{post}}) :next(new Error("post not found"))
});

export const freezePost = asyncHandler(async (req, res, next) => {
    const owner = req.user.role===roleTypes.admin ? {} : {createdBy: req.user._id}
    const post = await dbService.findByIdAndUpdate({
        model: postmodel,
        filter :{_id:req.params.postId , ...owner , isDeleted:false},
        data: {
            ...req.body,
            updateBy: req.user._id,
            deletedBy:req.user._id 
        },
        options:{
            new:true
        }
    });

    return post? successResponse({res , status:200 , data:{post}}) :next(new Error("post not found"))
});

export const unfreezePost = asyncHandler(async (req, res, next) => {
    const post = await dbService.findByIdAndUpdate({
        model: postmodel,
        filter :{_id:req.params.postId , deletedBy:req.user._id , isDeleted:true},
        data: {
            $unset:{
                deletedBy:0,
                isDeleted:0
            },
            updateBy: req.user._id
        },
        options:{
            new:true
        }
    });

    return post? successResponse({res , status:200 , data:{post}}) :next(new Error("post not found"))
});

export const likePost = asyncHandler(async (req, res, next) => {
    const data = req.query.action === 'unlike' ? {$pull: { likes: req.user_id }} : {$addToSet: { likes: req.user_id }}
    const post = await dbService.findOneAndUpdate(
        {
            model: postModel,
            filter: { _id: req.params.postId, isDeleted: false },
            update,
            options: { new: true }
        }
    );

    if (post) {
        return successResponse(res, { status: 200, data: post });
    }

    return next(new Error('post not found', { cause: 404 }));
});



