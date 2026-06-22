const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a product name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide product description'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide a product price'],
            default: 0.0,
        },
        originalPrice: {
            type: Number,
            default: null, 
        },
        currency: {
            type: String,
            enum: ['USD', 'EGP'],
            default: 'USD',
            required: true,
        },
        images: [
            {
                type: String, 
            },
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        stock: {
            type: Number,
            required: [true, 'Please provide product stock'],
            default: 0,
        },
        ratings: {
            average: {
                type: Number,
                default: 0,
            },
            count: {
                type: Number,
                default: 0,
            },
        },
    },
    { timestamps: true }
);

// Virtual field to calculate discount percentage
productSchema.virtual('discountPercentage').get(function() {
    if (this.originalPrice && this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

// Ensure virtuals are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
