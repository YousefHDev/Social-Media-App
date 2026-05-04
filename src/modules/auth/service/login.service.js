import { providerTypes, usermodel } from "../../../DB/model/User.model.js"
import { asyncHandler } from "../../../utilies/error.Response.js"
import { emailevent } from "../../../utilies/events/email.event.js"
import { compareHash, generateHash } from "../../../utilies/security/hash.security.js"
import { successResponse } from "../../../utilies/success.response.js"
import {  generateToken , Tokentypes } from "../../../utilies/security/token.security.js"
import { roleTypes } from "../../../DB/model/User.model.js"
import { AuthClient } from "google-auth-library"
import * as dbservice from "../../../DB/db.service.js"
import { decodedToken } from "../../../utilies/security/token.security.js"

export const login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body
	const User = await dbservice.findOne({ model: usermodel, filter: { email, provider: providerTypes.system } })

	if (!User) {
		return next(new Error("IN-VALID ACCOUNT", { cause: 404 }))
	}
	if (User.Confirmemail) {
		return next(new Error("VERIFIED your ACCOUNT FIRST", { cause: 400 }))
	}
	if (!compareHash({ plainText: password, hashValue: User.password })) {
		return next(new Error("IN-VALID ACCOUNT", { cause: 400 }))
	}
	const access_token = generateToken({
		payload: { id: User._id },
		signature:  [roleTypes.admin , roleTypes.superAdmin].includes(User.role) ? process.env.ADMIN_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN,
	})

	const refresh_token = generateToken({
		payload: { id: User._id },
		signature: [roleTypes.admin , roleTypes.superAdmin].includes(User.role) ? process.env.ADMIN_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,
		expiresIn: 31536000,
	})

	return successResponse({ res, data: { access_token, refresh_token } })
})

export const loginwithGmail = asyncHandler(async (req, res, next) => {
	const { idToken } = req.body
	const client = new OAuth2Client(process.env.CLIENT_ID)

	async function verify(idToken) {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.CLIENT_ID,
		})
		const payload = ticket.getPayload()
		return payload
	}
	const payload = await verify()
	if (!payload.email_verified) {
		return next(new Error("Invalid account", { cause: 400 }))
	}

	let user = await dbservice.findOne({ model: usermodel, filter: { email: payload.email } })
	if (!user) {
		user = await dbservice.create({
			model: usermodel,
			data: {
				username: payload.name,
				email: payload.email,
				confirmEmail: payload.email_verified,
				image: payload.picture,
				provider: providerTypes.google,
			},
		})
	}

	if (user.provider !== providerTypes.google) {
		return next(new Error("Invalid provider", { cause: 400 }))
	}

	const access_token = generateToken({
		payload: { id: User._id },
		signature: User.role === roleTypes.admin ? process.env.ADMIN_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN,
	})

	const refresh_token = generateToken({
		payload: { id: User._id },
		signature: User.role === roleTypes.admin ? process.env.ADMIN_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,
		expiresIn: 31536000,
	})

	return successResponse({
		res,
		data: {
			token: { access_token, refresh_token },
		},
	})
})

export const refreshToken = asyncHandler(async (req, res, next) => {
	const { authorization } = req.headers
	const user = await decodedToken({ authorization, Tokentype: Tokentypes.refresh, next })

	const refresh_token = generateToken({
		payload: { id: user._id },
		signature: user.role === roleTypes.admin ? process.env.ADMIN_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,
		expiresIn: 31536000,
	})

	return successResponse({ res, data: { access_token, refresh_token } })
})

export const forgotPassword = asyncHandler(async (req, res, next) => {
	const { email } = req.body
	const user = await dbservice.findOne({ model: usermodel, filter: { email, isDeleted: false } })
	if (!user) {
		return next(new Error("Invalid account", { cause: 404 }))
	}

	if (!user.confirmEmail) {
		return next(new Error("Verify your account first", { cause: 400 }))
	}

	emailevent.emit("forgotPassword", { id: User._id, email })

	return successResponse({ res })
})

export const validateForgotPassword = asyncHandler(async (req, res, next) => {
	const { email, code } = req.body

	const user = await dbservice.findOne({ model: usermodel, filter: { email, isDeleted: false } })
	if (!user) {
		return next(new Error("Invalid account", { cause: 404 }))
	}

	if (!user.confirmEmail) {
		return next(new Error("Verify your account first", { cause: 400 }))
	}

	if (!compareHash({ plainText: code, hashValue: user.resetPasswordOTP })) {
		return next(new Error("Invalid reset code", { cause: 400 }))
	}

	return successResponse({ res })
})

export const resetPassword = asyncHandler(async (req, res, next) => {
	const { email, code, password } = req.body

	const user = await dbservice.findOne({ model: usermodel, filter: { email, isDeleted: false } })
	if (!user) {
		return next(new Error("Invalid account", { cause: 404 }))
	}

	if (!user.confirmEmail) {
		return next(new Error("Verify your account first", { cause: 400 }))
	}

	if (!compareHash({ plainText: code, hashValue: user.resetPasswordOTP })) {
		return next(new Error("Invalid reset code", { cause: 400 }))
	}

	await dbService.updateOne({
		model: userModel,
		filter: { email },
		data: {
			password: generateHash({ plainText: password }),
			changeCredentialsTime: Date.now(),
			$unset: {
				resetPasswordOTP: 0,
			},
		},
	})

	return successResponse({ res })
})
