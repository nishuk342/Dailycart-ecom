const nodeMailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("Email credentials not configured. Skipping email send.");
            return;
        }

        const transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.warn("Email sending failed, continuing without email:", error.message);
    }
};

module.exports = sendEmail;