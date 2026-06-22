const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user._id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status: 'Error', message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ 
                    product: productId, 
                    quantity, 
                    price: product.price,
                    currency: product.currency || 'USD'
                }],
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ 
                    product: productId, 
                    quantity, 
                    price: product.price,
                    currency: product.currency || 'USD'
                });
            }
            await cart.save();
        }

        await cart.populate('items.product', 'name images price currency stock');
        res.status(200).json({ status: 'Success', data: cart });
    } catch (error) {
        next(error);
    }
};


const removeFromCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const productId = req.params.itemId; // Here itemId is actually the productId

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ status: 'Error', message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => {
            if (!item.product) return false; // Remove items with null product
            return item.product.toString() !== productId;
        });
        
        await cart.save();

        await cart.populate('items.product', 'name images price currency stock');
        res.status(200).json({ status: 'Success', data: cart });
    } catch (error) {
        console.error('Remove from cart error:', error);
        next(error);
    }
};


const updateQuantity = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const productId = req.params.itemId; // Here itemId is actually the productId
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ status: 'Error', message: 'Quantity cannot be less than 1' });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ status: 'Error', message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => {
            if (!item.product) return false;
            return item.product.toString() === productId;
        });

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            await cart.populate('items.product', 'name images price currency stock');
            res.status(200).json({ status: 'Success', data: cart });
        } else {
            res.status(404).json({ status: 'Error', message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Update quantity error:', error);
        next(error);
    }
};


const getCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name images price currency stock');

        if (!cart) {
            return res.status(200).json({ status: 'Success', data: { user: userId, items: [], totalPrice: 0 } });
        }

        const validItems = cart.items.filter(item => item.product !== null);
        
        if (validItems.length !== cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }

        res.status(200).json({ status: 'Success', data: cart });
    } catch (error) {
        console.error('Get cart error:', error);
        next(error);
    }
};


const clearCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.status(200).json({ status: 'Success', message: 'Cart cleared' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart,
    clearCart,
};
