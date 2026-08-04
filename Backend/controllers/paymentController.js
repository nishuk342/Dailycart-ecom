const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const createOrder = async (req, res) => {

    try {
        const { amount, currency = "INR" } = req.body;

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({ message: "Valid amount is required" });
        }

        if (!razorpay) {
            console.warn("Razorpay not configured - returning 503");
            return res.status(503).json({ message: "Razorpay is not configured" });
        }

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency,
            receipt: crypto.randomBytes(10).toString("hex")
        };

        try {
            const order = await razorpay.orders.create(options);
            res.status(200).json(order);
        } catch (razorpayError) {
            console.error("Razorpay order creation error:", razorpayError.message);
            return res.status(503).json({ 
                message: "Razorpay is not properly configured",
                error: razorpayError.message 
            });
        }

    } catch (error) {
        console.error("Payment controller error:", error);
        res.status(500).json({
            message: "Unable to create Razorpay order",
            error: error.message
        });

    }

};

const verifyPayment = async (req, res) => {

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            res.status(200).json({ message: "Payment verified successfully" });
        } else {
            res.status(400).json({ message: "Payment verification failed" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Unable to verify payment",
            error: error.message
        });
    }
};

module.exports = {createOrder, verifyPayment };