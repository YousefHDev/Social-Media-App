import { customAlphabet } from "nanoid";
import { EventEmitter } from "node:events";
import { generateHash } from "../security/hash.security.js";
import { usermodel } from "../../DB/model/User.model.js";
import { sendEmail } from "../email/send.email.js";
import { verifyAccountTemplate } from "../email/template/verifyAccount.template.js";
import * as dbservice from "../../DB/db.service.js"
import { updateEmail } from "../../modules/user/user.validation.js";

export const emailevent = new EventEmitter();

export const emailSubject = {
    confirmEmail: "Confirm-Email",
    resetPassword: "Reset-Password",
    updateEmail: "updateEmail"
};

export const sendCode = async ({ data = {}, subject = emailSubject.confirmEmail } = {}) => {
    const { id,email } = data;
    const otp = customAlphabet("123456789", 4)();
    const hashOTP = generateHash({ plainText: otp });

    let updateData = {};
    switch (subject) {
        case emailSubject.confirmEmail:
            updateData = { confirmEmailOTP: hashOTP };
            break;
        case emailSubject.resetPassword:
            updateData = { resetPasswordOTP: hashOTP };
            break;
         case emailSubject.updateEmail:
            updateData = { tempEmailOTP: hashOTP };
            break;
            
        default:
            break;
    }

await dbService.updateOne({
    model: userModel,
    filter: { _id: id },
    data: updateData
});
    const html = verifyAccountTemplate({ code: otp });
    await sendEmail({ to: email, subject, html });
};

emailevent.on("sendConfirmEmail",async(data)=>{
    await sendCode({data})
})

emailevent.on("updateEmail",async(data)=>{
    await sendCode({data , subject:emailSubject.updateEmail})
})

emailevent.on("forgotPassword", async(data)=>{
    await sendCode({data , subject:emailSubject.resetPassword})
})