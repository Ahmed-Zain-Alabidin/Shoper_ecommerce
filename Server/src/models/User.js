const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
        },
        phone: {
            type: String,
        },
        role: {
            type: String,
            enum: ['customer', 'seller', 'admin'],
            default: 'customer',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isSuspended: {
            type: Boolean,
            default: false,
        },
        addresses: [
            {
                alias: { type: String, required: true },
                street: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                postalCode: { type: String, required: true },
                phone: { type: String, required: true },
            }
        ],
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        paymentDetails: {
            customerId: String,
            provider: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
