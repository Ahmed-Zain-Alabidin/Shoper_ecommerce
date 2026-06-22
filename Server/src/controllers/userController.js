const User = require('../models/User');
const bcrypt = require('bcryptjs');

const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user._id);

        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ status: 'Error', message: 'Product already in wishlist' });
        }

        user.wishlist.push(productId);
        await user.save();

        res.status(200).json({
            status: 'Success',
            message: 'Product added to wishlist',
            data: user.wishlist,
        });
    } catch (error) {
        next(error);
    }
};


const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);

        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        res.status(200).json({
            status: 'Success',
            message: 'Product removed from wishlist',
            data: user.wishlist,
        });
    } catch (error) {
        next(error);
    }
};


const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json({ status: 'Success', data: user });
    } catch (error) {
        next(error);
    }
};


const updateMe = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        
        if (req.body.password) {
            return res.status(400).json({ status: 'Error', message: 'This route is not for password updates. Please use /changePassword.' });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, phone },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({ status: 'Success', data: user });
    } catch (error) {
        next(error);
    }
};


const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'Error', message: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ status: 'Success', message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};

const addAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        user.addresses.push(req.body);
        await user.save();

        res.status(201).json({ status: 'Success', data: user.addresses });
    } catch (error) {
        next(error);
    }
};

const removeAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        user.addresses = user.addresses.filter(
            (address) => address._id.toString() !== req.params.addressId
        );
        await user.save();

        res.status(200).json({ status: 'Success', data: user.addresses });
    } catch (error) {
        next(error);
    }
};


const getAddresses = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('addresses');
        res.status(200).json({ status: 'Success', data: user.addresses });
    } catch (error) {
        next(error);
    }
};

module.exports = {
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
};

// ── Admin: list all users ─────────────────────────────────────────────────────
async function getAllUsers(req, res, next) {
    try {
        const users = await User.find({}).select('-password').sort('-createdAt');
        res.status(200).json({ status: 'Success', count: users.length, data: users });
    } catch (error) {
        next(error);
    }
}

async function updateUserStatus(req, res, next) {
    try {
        const { isVerified, isSuspended } = req.body;
        const updates = {};
        if (typeof isVerified === 'boolean') updates.isVerified = isVerified;
        if (typeof isSuspended === 'boolean') updates.isSuspended = isSuspended;

        const user = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!user) {
            return res.status(404).json({ status: 'Error', message: 'User not found' });
        }
        res.status(200).json({ status: 'Success', data: user });
    } catch (error) {
        next(error);
    }
}
