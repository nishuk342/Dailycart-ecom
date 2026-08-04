const SibApiV3Sdk = require('@getbrevo/brevo');

const sendEmail = async (to, subject, text) => {
    try {
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        apiInstance.setApiKey(
            SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );

        await apiInstance.sendTransacEmail({
            sender: {
                email: process.env.EMAIL_USER,
                name: "DailyCart"
            },
            to: [
                {
                    email: to
                }
            ],
            subject,
            textContent: text
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Brevo Error:", error.response?.body || error.message);
    }
};

module.exports = sendEmail;
