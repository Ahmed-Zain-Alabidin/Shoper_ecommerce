const Review = require('../models/Review');
const Product = require('../models/Product');

// Helper function to recalculate product ratings
const updateProductRatings = async (productId) => {
    const reviews = await Review.find({ product: productId });
    
    if (reviews.length === 0) {
        await Product.findByIdAndUpdate(productId, {
            'ratings.average': 0,
            'ratings.count': 0,
        });
        return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
        'ratings.average': Math.round(averageRating * 10) / 10, // Round to 1 decimal
        'ratings.count': reviews.length,
    });
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
    try {
        const { product: productId, rating, comment } = req.body;
        const userId = req.user._id;

        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ status: 'Error', message: 'Product not found' });
        }

        const alreadyReviewed = await Review.findOne({ product: productId, user: userId });
        if (alreadyReviewed) {
            return res.status(400).json({ status: 'Error', message: 'Product already reviewed' });
        }

        const review = await Review.create({
            product: productId,
            user: userId,
            rating,
            comment,
        });

        // Update product ratings
        await updateProductRatings(productId);

        // Populate user info before sending response
        await review.populate('user', 'name');

        res.status(201).json({ status: 'Success', data: review });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
    try {
        // req.params.productId can come from the nested productRoutes
        const productId = req.params.productId || req.body.product;
        
        const reviews = await Review.find({ product: productId }).populate('user', 'name');

        res.status(200).json({
            status: 'Success',
            count: reviews.length,
            data: reviews,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ status: 'Error', message: 'Review not found' });
        }

        // Make sure user is review owner or admin
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'Error', message: 'Not authorized to delete this review' });
        }

        const productId = review.product;
        await review.deleteOne();

        // Update product ratings after deletion
        await updateProductRatings(productId);

        res.status(200).json({ status: 'Success', message: 'Review removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview,
    getProductReviews,
    deleteReview,
};
