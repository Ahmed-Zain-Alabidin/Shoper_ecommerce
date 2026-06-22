const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a category name'],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            lowercase: true,
            unique: true,
        },
        image: {
            type: String, 
        },
    },
    { timestamps: true }
);

categorySchema.pre('save', function () {
    if (this.isModified('name')) {
        this.slug = this.name.split(' ').join('-').toLowerCase();
    }
});

module.exports = mongoose.model('Category', categorySchema);
