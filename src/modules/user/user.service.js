import { asyncHandler } from "../../utilies/error.Response.js"
import { successResponse } from "../../utilies/success.response.js"
import * as dbservice from "../../DB/db.service.js"
import { usermodel } from "../../DB/model/User.model.js";
import { generateHash } from "../../utilies/security/hash.security.js";
import { cloud } from "../../utilies/multer/cloudinary.multer.js";
import { postmodel } from "../../DB/model/post.model.js";


export const dashboard = asyncHandler(async (req, res, next) => {
    const result = await Promise.allSettled([await dbservice.find({
        model:postmodel,
        filter:{},

    }),
    dbservice.find({
        model: usermodel,
        filter: {  },
        populate: [
            { 
                path: "viewers.userId",
                select:"username image"
             }
        ]
    })
])
    
    return successResponse({ res, data: { result } });
});

export const changeRoles = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { role } = req.body;

    const roles = req.user.role === roleTypes.superAdmin 
        ? { role: { $nin: [roleTypes.superAdmin] } } 
        : { role: { $nin: [roleTypes.admin, roleTypes.superAdmin] } };

    const user = await dbService.findOneAndUpdate({
        model: userModel,
        filter: {
            _id: userId,
            isDeleted: { $exists: false },
            ...roles
        },
        data: {
            role,
            updateBy:req.user._id
        }
    });

    return successResponse({ res, data: { user } });
});

export const profile = asyncHandler(async (req, res, next) => {
    const user = await dbservice.findOne({
        model: usermodel,
        filter: { _id: req.user._id },
        populate: [
            { 
                path: "viewers.userId",
                select:"username image"
             }
        ]
    });
    return successResponse({ res, data: { user } });
});


export const updateProfile = asyncHandler(async (req, res, next) => {
    const user = await dbService.findOneAndUpdate({
        model: userModel,
        filter: { _id: req.user._id },
        data: req.body
    });

    return successResponse({ res, data: { user } });
});

export const updateProfileImage = asyncHandler(async (req, res, next) => {
    const {secure_url,public_id}=await cloud.uploader.upload(req.file.path)
    const user = await dbservice.findOneAndUpdate({
        model: usermodel,
        filter: { _id: req.user._id },
        data: {
            image:{secure_url,public_id}
        },
        options: { new: true }
    });
    if (user.image?.public_id) {
        
        await cloud.uploader.destroy(user.image.public_id)
    }



    return successResponse({ res, data: { user } });
});

export const updateProfileCoverImage = asyncHandler(async (req, res, next) => {
    let images = []
    for (const file of req.files) {
        const {secure_url,public_id}=await cloud.uploader.upload(file.path)
        images.push({secure_url , public_id})
    }


    const user = await dbservice.findOneAndUpdate({
        model: usermodel,
        filter: { _id: req.user._id },
        data: {
            coverImage:images
        },
        options: { new: true }
    });
    return successResponse({ res, data: { user } });
});

export const updateProfileIdentity = asyncHandler(async (req, res, next) => {
    
    return successResponse({ res, data: { file:req.files } });
});

export const shareProfile = asyncHandler(async (req, res, next) => {
    const { profileId } = req.params;
    let user = null;
    if (profileId === req.user._id.toString()) {
        user = req.user;
    } else {
        user = await dbService.findOneAndUpdate({
            model: userModel,
            filter: { _id: profileId, isDeleted: false },
            data: {
                $push: { viewers: { userId: req.user._id, time: Date.now() } }
            },
            select: 'username image email'
        });
    }

    return user ? successResponse({ res, data: { user } }) : next(new Error("In-valid account", { cause: 404 }));
});

export const updateEmail = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (await dbservice.findOne({ model: userModel, filter: { email } })) {
        return next(new Error("Email exist", { cause: 409 }));
    }

    await dbservice.updateOne({ model: userModel, filter: { _id: req.user._id }, data: { tempEmail: email } });
    emailEvent.emit("sendConfirmEmail", { id: req.user._id, email: req.user.email });

    emailEvent.emit("updateEmail", { id: req.user._id, email });

    return successResponse({ res });
});

export const resetEmail = asyncHandler(async (req, res, next) => {
    const { oldCode, newCode } = req.body;

    if (
        !compareHash({ plainText: oldCode, hashValue: req.user.confirmEmailOTP }) ||
        !compareHash({ plainText: newCode, hashValue: req.user.tempEmailOTP })
    ) {
        return next(new Error("In-valid provided codes", { cause: 400 }));
    }

    await dbService.updateOne({
        model: userModel,
        filter: { _id: req.user._id },
        data: {
            email: req.user.tempEmail,
            changeCredentialsTime: Date.now(),
            $unset: {
                tempEmail: 0,
                tempEmailOTP: 0,
                confirmEmailOTP: 0
            }
        }
    });

    return successResponse({ res , data:{} });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldpassword, password } = req.body;

    if (
        !compareHash({ plainText: oldpassword, hashValue: req.user.password }) 
    ) {
        return next(new Error("In-valid provided codes", { cause: 400 }));
    }

    await dbService.updateOne({
        model: userModel,
        filter: { _id: req.user._id },
        data: {
            password:generateHash({plainText:password}),
            changeCredentialsTime: Date.now(),
           
        }
    });

    return successResponse({ res , data:{} });
});