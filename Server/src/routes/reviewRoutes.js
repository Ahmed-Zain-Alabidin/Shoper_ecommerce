const express = require('express');
const router = express.Router({ mergeParams: true }); 
const { protect } = require('../middlewares/authMiddleware');
const { createReview, getProductReviews, deleteReview } = require('../controllers/reviewController');

router.route('/')
    .get(getProductReviews)
    .post(protect, createReview);

router.route('/:id')
    .delete(protect, deleteReview);

module.exports = router;
