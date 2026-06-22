const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { body, validationResult } = require('express-validator');


const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ status: 'Error', errors: errors.array() });
    };
};

router.post(
    '/signup',
    validate([
        body('name', 'Name is required').not().isEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ]),
    signup
);

router.post(
    '/login',
    validate([
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password is required').exists(),
    ]),
    login
);

module.exports = router;
