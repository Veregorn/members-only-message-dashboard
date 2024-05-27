// Import models
const User = require('../models/user');

// Import async
const asyncHandler = require('express-async-handler');

// Import validator
const { body, validationResult } = require('express-validator');

// Display user create form on GET.
exports.user_create_get = asyncHandler(async function (req, res, next) {
    res.render('user_form', {
        title: 'Create User',
        user: null,
        errors: null,
        succeeded: false,
        layout: 'layout',
    });
});

// Handle user create on POST.
exports.user_create_post = asyncHandler([
    // Validate and sanitize fields
    body('first_name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('First name must not be empty and must not be greater than 100 characters.')
        .escape(),
    body('last_name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Last name must not be empty and must not be greater than 100 characters.')
        .escape(),
    body('username')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Username must not be empty and must not be greater than 100 characters.')
        .escape(),
    body('password')
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Password must not be empty and must not be greater than 30 characters.')
        .escape(),
    body('password2')
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Password must not be empty and must not be greater than 30 characters.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
        .escape(),
    body('status')
        .escape(),

    // Process request after validation and sanitization
    asyncHandler(async function (req, res, next) {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a user object with escaped and trimmed data.
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            status: req.body.status,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('user_form', {
                title: 'Create User',
                user: user,
                errors: errors.array(),
                succeeded: false,
                layout: 'layout',
            });
            return;
        } else {
            // Data from form is valid. Save user.
            await user.save();
            res.render('user_form', {
                title: 'Create User',
                user: user,
                errors: null,
                succeeded: true,
                layout: 'layout',
            });
        }
    }),
]);