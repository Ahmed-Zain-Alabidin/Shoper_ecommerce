const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart,
    clearCart,
} = require('../controllers/cartController');

router.use(protect); // Protect all cart routes

router.route('/')
    .get(getCart)
    .post(addToCart)
    .delete(clearCart);

router.route('/:itemId')
    .put(updateQuantity)
    .delete(removeFromCart);

module.exports = router;
