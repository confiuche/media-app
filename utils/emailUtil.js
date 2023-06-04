import nodemailer from 'nodemailer'

const sendEmail = async (to,subject,html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions= {
        from: "DUC FLOW"+process.env.EMAIL_ADDRESS,
        to,
        subject,
        html
    };
    await transporter.sendMail(mailOptions)
}

export default sendEmail;