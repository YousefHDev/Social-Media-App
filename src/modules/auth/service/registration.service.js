import { usermodel } from "../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utilies/error.Response.js"
import { emailevent } from "../../../utilies/events/email.event.js";
import { compareHash, generateHash } from "../../../utilies/security/hash.security.js";
import { successResponse } from "../../../utilies/success.response.js";
import * as dbservice from "../../../DB/db.service.js"



export const signup = asyncHandler(async (req, res, next) => {
    const {username , email , password} = req.body;
    console.log({username , email , password});

    if (await dbservice.findOne({model:usermodel , filter: {email}})) {
        return next(new Error("Email exist",{cause:409}))
        
    }

    const hashpassword = generateHash({plainText:password});
    const user = await dbservice.create({
      model:usermodel,
      data:{username , email , password:generateHash({plainText:password})}
    })

    emailevent.emit("sendConfirmEmail" , {id:user._id , email})
    
    return successResponse({res , message: "Done",status:201 , data:{user}})
})


 export const Confirmemail = asyncHandler(async (req, res, next) => {
    const { email , code} = req.body;
  	const user = await dbservice.findOne({model:usermodel , filter: {email} })
    
    if (!user) {
         return next(new Error("IN-VALID ACCOUNT",{cause:404}))
        
    }
   if (user.confirmEmail) {
        return next(new Error("ALREADY VERIFIED",{cause:409}))
        
      }
      if (!compareHash({plainText:code , hashValue:user.confirmEmailOTP})) {
       return next(new Error("IN-VALID CODE",{cause:400}))
        
    }
   await dbservice.updateOne({
  model: usermodel,
    filter: { email },
  data: {
      confirmEmail: true,
      $unset: {
         confirmEmailOTP: 0
      }
   }
 });
   
    return successResponse({res })
 })
// export const Confirmemail = async (req, res, next) => {
// 	const { email, code } = req.body
// 	const user = await dbservice.findOne({model:usermodel , filter: {email} })

// 	if (!user) {
//         console.log("User not found");
//         return next(new Error("IN-VALID ACCOUNT", { cause: 404 }));
//       }
      
//       if (user.Confirmemail) {
//         console.log("User is already verified");
//         return next(new Error("ALREADY VERIFIED", { cause: 409 }));
//       }
      
//       console.log("Provided code:", code);
//       console.log("Stored OTP:", user.confirmEmailOTP);
      
//       if (code != user.confirmEmailOTP) {
//         console.log("Invalid code provided");
//         return next(new Error("IN-VALID CODE", { cause: 400 }));
//       }
      
// }



