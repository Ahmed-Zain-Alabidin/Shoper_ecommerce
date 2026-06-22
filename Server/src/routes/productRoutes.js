const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const reviewRouter = require("./reviewRoutes");
router.use("/:productId/reviews", reviewRouter);

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  authorize("seller", "admin"),
  upload.array("images", 5),
  createProduct,
);

router.put(
  "/:id",
  protect,
  authorize("seller", "admin"),
  upload.array("images", 5),
  updateProduct,
);

router.delete("/:id", protect, authorize("seller", "admin"), deleteProduct);

module.exports = router;
