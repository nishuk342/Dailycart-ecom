const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

const createOrder = async (req, res) => {
    try {
        const { products, items, totalAmount, address, paymentId } = req.body;
        const normalizedProducts = (products || items || []).map((item) => ({
            productId: item.productId || item._id,
            quantity: item.quantity || item.qty || 1,
            price: item.price
        }));

        if (!normalizedProducts.length || !totalAmount || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const order = new Order({
            user: req.user._id,
            products: normalizedProducts,
            totalAmount,
            address,
            paymentId
        });

        await order.save();
        
        const message = `Dear ${req.user.name},\n\nYour order has been created successfully. Your order ID is ${order._id}.\n\nThank you for shopping with us!\n\nBest regards,\nDailyCart Team`;

        try {
            await sendEmail(req.user.email, "Order Created", message);
        } catch (emailError) {
            console.warn("Order created, but email notification failed:", emailError.message);
        }

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('products.productId', 'name price');
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name'); 
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if(order){
            order.status = status;
            await order.save();
            res.status(200).json({ message: "Order status updated successfully", order });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus
};