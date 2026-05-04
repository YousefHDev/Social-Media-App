
import { Router } from 'express'
import * as registrationService from './service/registration.service.js';
import * as loginService from './service/login.service.js';
import * as validators from './auth.validation.js'
import { validation } from '../../middleware/validation.middleware.js';

const router = Router();


router.post("/signup",validation(validators.signup), registrationService.signup)
router.patch("/confirm-email",validation(validators.Confirmemail), registrationService.Confirmemail)
router.post("/login",validation(validators.login), loginService.login)
router.post("/loginwithGmail", loginService.loginwithGmail)


router.get("/refresh-token",loginService.refreshToken)

router.patch("/forgot-Password",validation(validators.forgotPassword) , loginService.forgotPassword)
router.patch("/Validate-forgot-Password",validation(validators.validateForgotPassword) , loginService.validateForgotPassword)
router.patch("/reset-Password",validation(validators.resetPassword) , loginService.resetPassword)



export default router