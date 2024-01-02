import nodemailer from "nodemailer"


export async function sendEmail(email, subject, html) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: process.env.USER_EMAIL, 
        to: email, 
        subject, 
        html,
    });
    
    console.log("Message sent: %s", info.messageId);
    return info.rejected.length ? false : true;

}
