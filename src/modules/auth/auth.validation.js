import joi from 'joi';
import { generalfields } from '../../middleware/validation.middleware.js';

export const signup = joi.object().keys({
  username: generalfields.username.required(),
  email:generalfields.email.required(),
  password: generalfields.password.required(),
  confirmationPassword:generalfields.confirmationPassword.required(),
}).required();

export const Confirmemail = joi.object().keys({
    
    email:generalfields.email.required(),
    code: generalfields.code.required()
  }).required();

  export const validateForgotPassword = Confirmemail


  export const login = joi.object().keys({
    email:generalfields.email.required(),
    password: generalfields.password.required(),
  }).required();

  export const forgotPassword = joi.object().keys({
    
    email:generalfields.email.required(),
  }).required();

  export const resetPassword = joi.object().keys({
    code: generalfields.code.required(),
    email: generalfields.email.required(),
    password: generalfields.password.required(),
    confirmationPassword: generalfields.confirmationPassword.valid(joi.ref('password')).required()
       
}).required();

