// Import models
const User = require('../models/user');

// Import async
const asyncHandler = require('express-async-handler');

// Import validator
const { body, validationResult } = require('express-validator');

// Import bcrypt for password hashing
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config();

// Import passport for authentication
const passport = require('passport');

// Display user create form on GET.
exports.user_create_get = asyncHandler(async function (req, res, next) {
    res.render('create_user_form', {
        title: 'Create User',
        user: null,
        errors: null,
        layout: 'layout',
    });
});

// Handle user create on POST.
exports.user_create_post = [
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
        .custom((value, { req }) => {
            if (value === 'admin' && req.body.secret !== process.env.ADMIN_SECRET) {
                throw new Error("You don't know the secret. You are not authorized to create an admin user");
            }
            if (value === 'member' && req.body.secret !== process.env.MEMBER_SECRET) {
                throw new Error("You don't know the secret. You are not authorized to create a member user");
            }
            return true;
        })
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
            req.flash('error_msg', 'There are errors. Please correct the form.');
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('create_user_form', {
                title: 'Create User',
                user: user,
                errors: errors.array(),
                layout: 'layout',
            });
            return;
        } else {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword;

            // Data from form is valid. Save user.
            await user.save();
            req.flash('success_msg', 'User created successfully. Please login.');
            res.redirect('/user/login');
        }
    }),
];

// Display user login form on GET.
exports.user_login_get = asyncHandler(async function (req, res, next) {
    res.render('login_user_form', {
        title: 'Login',
        user: null,
        errors: null,
        layout: 'layout',
    });
});

// Handle user login on POST.
exports.user_login_post = asyncHandler(async function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('error_msg', info.message);
        return res.redirect('/user/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    })(req, res, next);
});

// Handle user logout on GET.
exports.user_logout_get = asyncHandler(async function (req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// Display user profile on GET.
exports.user_profile_get = asyncHandler(async function (req, res, next) {
    res.render('profile', {
        title: 'User Profile',
        user: req.user,
        layout: 'layout',
    });
});

// Handle user profile on POST (status change).
exports.user_profile_post = asyncHandler(async function (req, res, next) {
    // Find user by ID
    const user = await User.findById(req.user._id).exec();

    // Check if user exists
    if (user === null) {
        const err = new Error('User not found');
        err.status = 404;
        return next(err);
    }

    // Check if user have the secret to change status (member or admin)
    if (req.body.status === 'admin' && req.body.secret !== process.env.ADMIN_SECRET) {
        req.flash('error_msg', "You don't know the secret. You are not authorized to change to admin status");
        return res.redirect('/user/profile');
    }
    if (req.body.status === 'member' && req.body.secret !== process.env.MEMBER_SECRET) {
        req.flash('error_msg', "You don't know the secret. You are not authorized to change to member status");
        return res.redirect('/user/profile');
    }

    // Change status
    user.status = req.body.status;

    // Update user in database
    await User.findByIdAndUpdate(req.user._id, user, {});

    // Redirect to profile page
    res.redirect('/user/profile');
});