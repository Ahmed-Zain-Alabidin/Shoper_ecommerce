const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        enum: ['USD', 'EGP'],
        default: 'USD',
    },
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [cartItemSchema],
        totalPrice: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Pre-save hook to calculate total price
cartSchema.pre('save', async function () {
    this.totalPrice = this.items.reduce((total, item) => {
        return total + item.quantity * item.price;
    }, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
