const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const streamUpload = (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'ecommerce/categories' },
            (error, result) => (result ? resolve(result) : reject(error))
        );
        Readable.from(buffer).pipe(stream);
    });


const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        let imageUrl = '';
        if (req.file) {
            const result = await streamUpload(req.file.buffer);
            imageUrl = result.secure_url;
        }

        const category = await Category.create({ name, image: imageUrl });

        res.status(201).json({ status: 'Success', data: category });
    } catch (error) {
        next(error);
    }
};


const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({ status: 'Success', count: categories.length, data: categories });
    } catch (error) {
        next(error);
    }
};


const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ status: 'Error', message: 'Category not found' });
        }
        res.status(200).json({ status: 'Success', data: category });
    } catch (error) {
        next(error);
    }
};


const updateCategory = async (req, res, next) => {
    try {
        const updates = { name: req.body.name };

        if (req.file) {
            const result = await streamUpload(req.file.buffer);
            updates.image = result.secure_url;
        }

        const category = await Category.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            return res.status(404).json({ status: 'Error', message: 'Category not found' });
        }

        res.status(200).json({ status: 'Success', data: category });
    } catch (error) {
        next(error);
    }
};


const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ status: 'Error', message: 'Category not found' });
        }
        await category.deleteOne();
        res.status(200).json({ status: 'Success', message: 'Category removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
