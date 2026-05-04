import joi from 'joi';
import { generalfields } from '../../middleware/validation.middleware.js';

export const profileImage = joi.object().keys({
    file : joi.object().required()
}).required()

export const ShareProfile = joi.object().keys({

    profileId: generalfields.id.required()
}).required();


export const updateEmail = joi.object().keys({
    email: generalfields.email.required()
}).required();

export const resetEmail = joi.object().keys({
    oldCode: generalfields.code.required(),
    newCode: generalfields.code.required()
}).required();

export const updatePassword = joi.object().keys({
    oldpassword: generalfields.password.required(),
    password: generalfields.password.not(joi.ref('old password')).required(),
    confirmationpassword: generalfields.confirmationPassword.valid(joi.ref("password")).required(),
}).required();

export const updateProfile = joi.object().keys({
    username: generalfields.username,
    DOB: generalfields.DOB,
    gender: generalfields.gender,
    phone: generalfields.phone,
    address: generalfields.address
  }).required();
  