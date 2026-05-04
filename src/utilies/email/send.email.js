import nodemailer from 'nodemailer';
export const sendEmail = async ({
    to = [],
    cc = [],
    bcc = [],
    text = "",
    html = "",
    subject = "route",
    attachments = []
  } = {}) => {
    
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    const info = await transporter.sendMail({
      from: `"ROUTE" <${process.env.EMAIL}>`, // sender address
      to,
      cc,
      bcc,
      text,
      html,
      subject,
      attachments,
    });
    console.log("Message sent: %s", info.messageId);
  };
  