const   Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({role: "user"});
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        const orders = await Order.find({});

        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        res.status(200).json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching admin stats", error });
    }
};

module.exports = { getAdminStats };