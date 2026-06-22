const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');


const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress } = req.body;

        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ status: 'Error', message: 'Your cart is empty' });
        }

        const user = await User.findById(req.user._id);
        const addressDetails = user.addresses?.find(a => a._id.toString() === shippingAddress);

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
        }));

        const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddressDetails: addressDetails || {},
            totalPrice,
            status: 'pending',
        });

        cart.items = [];
        await cart.save();

        res.status(201).json({ status: 'Success', data: order });
    } catch (error) {
        next(error);
    }
};

const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('orderItems.product', 'name images price')
            .sort('-createdAt');

        res.json({ status: 'Success', count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('orderItems.product', 'name price images')
            .sort('-createdAt');

        res.json({ status: 'Success', count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ status: 'Error', message: 'Order not found' });
        }

        res.json({ status: 'Success', data: order });
    } catch (error) {
        next(error);
    }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
