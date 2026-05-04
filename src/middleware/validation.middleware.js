import { Schema, Types } from "mongoose";
import joi from 'joi';
import { genderTypes } from "../DB/model/User.model.js";

export const isValidObjectId= (value , helper)=>{
  return Types.ObjectId.isValid(value) ? true : helper.message("In-valid object Id")
}
export const generalfields={
    username: joi.string().min(2).max(50).trim(),
      email: joi.string()
        .email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'net'] } })
        ,
      password: joi.string()
        .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
        ,
      confirmationPassword: joi.string(),
      code:joi.string().pattern(new RegExp(/^\d{4}$/)),
      id:joi.string().custom(isValidObjectId),
      DOB: joi.date().less("now"),
      gender: joi.string().valid(...Object.values(genderTypes)),
      address: joi.string(),
      phone: joi.string().pattern(new RegExp("/(002|\\+2)?01[0125][0-9][8]$/")),
      file:joi.string(),
      

}

export const validation = (Schema)=>{
    return (req , res , next) =>{
        const inputs = {...req.query, ...req.body, ...req.params};
        if (req.file || req.files?.length) {
          inputs.file = req.file || req.files
          
        }
        console.log({inputs});
        
        const validationResult = Schema.validate(inputs , {abortEarly: false});
        if (validationResult.error) {
            
            return res.status(400).json({message: "Validation error",details:validationResult.error.details})
        }
        return next()
    }
}