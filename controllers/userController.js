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
        layout: 'layout',
    });
});

// Handle user create on POST.
exports.user_create_post = asyncHandler([
    // Validate and sanitize fields
    body('first_name', 'First name must not be empty.')
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    body('last_name', 'Last name must not be empty.')
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    body('username', 'Username must not be empty.')
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    body('password', 'Password must not be empty.')
        .trim()
        .isLength({ min: 1, max: 30 })
        .escape(),
    body('password2', 'Passwords do not match.')
        .custom((value, { req }) => value === req.body.password),
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
                layout: 'layout',
            });
            return;
        } else {
            // Data from form is valid. Save user.
            // await user.save();
            res.redirect(user.url);
        }
    }),
]);