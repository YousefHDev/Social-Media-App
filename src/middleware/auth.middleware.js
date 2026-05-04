import { asyncHandler } from "../utilies/error.Response.js";
import { verifyToken } from "../utilies/security/token.security.js";
import {decodedToken} from "../utilies/security/token.security.js"


export const authentication = ()=> {
   return asyncHandler(async(req , res , next)=>{
    const {authorization} = req.headers;
    req.user = await decodedToken({authorization , next})  
    return next()
           
    })
}

export const authorization = (accessRoles = []) => {
    return asyncHandler(async (req, res, next) => {
        if (!accessRoles.includes(req.user.role)) {
            return next(new Error("Not Authorized account", { cause: 403 }));
        }
        return next();
    });
};