const nodeMailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("Email credentials not configured. Skipping email send.");
            return;
        }

        const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    logger: true,
    debug: true,
});

transporter.verify((err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("SMTP Ready");
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
