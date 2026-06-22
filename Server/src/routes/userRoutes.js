const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { 
    addToWishlist, 
    removeFromWishlist,
    getMe,
    updateMe,
    changePassword,
    addAddress,
    removeAddress,
    getAddresses,
    getAllUsers,
    updateUserStatus,
} = require('../controllers/userController');

router.use(protect); // Protect all user routes

// Profile
router.get('/me', getMe);
router.put('/updateMe', updateMe);
router.put('/changePassword', changePassword);

// Addresses
router.route('/addresses')
    .get(getAddresses)
    .post(addAddress);
router.delete('/addresses/:addressId', removeAddress);

// Wishlist
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

// Admin — user management
router.get('/', authorize('admin'), getAllUsers);
router.put('/:id/status', authorize('admin'), updateUserStatus);

module.exports = router;
