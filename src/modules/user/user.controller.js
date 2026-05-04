import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import * as profileService from "../user/user.service.js"
import * as validators from "../user/user.validation.js"
import { validation } from "../../middleware/validation.middleware.js";
import { fileValidations, uploadFileDisk } from "../../utilies/multer/local.multer.js";
import { uploadCloudfile } from "../../utilies/multer/cloud.multer.js";
import { endpoint } from "./user.auth.js";
const router = Router();

router.get("/profile", authentication(),authorization(endpoint.changeRoles), profileService.profile);
router.patch("/:userId/profile/dashboard/role", authentication(),authorization(endpoint.changeRoles), profileService.changeRoles);
router.get("/profile/dashboard", authentication(), profileService.dashboard);

router.get("/profile/profileId",validation(validators.ShareProfile), authentication(), profileService.shareProfile);


router.patch("/profile",validation(validators.updateProfile), authentication(), profileService.updateProfile);
router.patch("/profile/image", 
    authentication(), 
    uploadCloudfile(fileValidations.image).single('attachment'), 
    validation(validators.profileImage),
    profileService.updateProfileImage
);

router.patch("/profile/image/cover", 
    authentication(), 
    uploadFileDisk('user/profile', fileValidations.image).array('image', 3), 
    profileService.updateProfileCoverImage
);

router.patch("/profile/identity",
    authentication(),
    uploadFileDisk('user/profile', [...fileValidations.document, ...fileValidations.image]).fields([
        { name: 'image', maxCount: 1 },
        { name: "data", maxCount: 2 }
    ]),
    profileService.updateProfileIdentity
);

router.patch("/profile/email",validation(validators.updateEmail), authentication(), profileService.updateEmail);
router.patch("/profile/resetemail",validation(validators.resetEmail), authentication(), profileService.resetEmail);
router.patch("/profile/updatepassword",validation(validators.updatePassword), authentication(), profileService.updatePassword);






export default router;