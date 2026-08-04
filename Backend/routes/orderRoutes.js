const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const { createOrder, getMyOrders, getOrders, updateOrderStatus } = require("../controllers/orderController");

const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, admin, getOrders);
router.route("/:id/status").put(protect, admin, updateOrderStatus);
router.route("/myorders").get(protect, getMyOrders);

module.exports = router;