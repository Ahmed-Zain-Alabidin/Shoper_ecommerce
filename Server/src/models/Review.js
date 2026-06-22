const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please add a rating between 1 and 5'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, 'Please add a comment'],
        },
    },
    { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.getAverageRating = async function (productId) {
    const obj = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 },
            },
        },
    ]);

    try {
        const Product = mongoose.model('Product');
        if (obj.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                'ratings.average': Math.round(obj[0].averageRating * 10) / 10,
                'ratings.count': obj[0].numOfReviews,
            });
        } else {
            await Product.findByIdAndUpdate(productId, {
                'ratings.average': 0,
                'ratings.count': 0,
            });
        }
    } catch (err) {
        console.error(err);
    }
};

reviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.product);
});

reviewSchema.post('deleteOne', { document: true, query: false }, function () {
    this.constructor.getAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
