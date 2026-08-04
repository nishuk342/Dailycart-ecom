const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const {getProducts, getProductById, createProduct, updateProduct, deleteProduct} = require("../controllers/productController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

const router = express.Router();

// router.get("/",getProducts);
// router.post("/", protect, admin, createProduct);
// Another way to write the above two lines is as follows:
router.route("/").get(getProducts).post(protect, admin, upload.single("image"), createProduct);
router.route("/:id").get(getProductById).put(protect, admin, upload.single("image"), updateProduct)
        .delete(protect, admin, deleteProduct);

module.exports = router;