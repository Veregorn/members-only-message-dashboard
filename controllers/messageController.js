// Import models
const Message = require('../models/message');

// Import async
const asyncHandler = require('express-async-handler');

// Import validator
const { body, validationResult } = require('express-validator');

// Display list of all messages on index page (home page).
exports.index = asyncHandler(async function (req, res, next) {
    const messages = await Message.find()
        .sort({timestamp: -1})
        .populate('user')
        .exec();

    res.render('message_list', {
        title: 'Message Board',
        messages: messages,
        layout: 'layout',
    });
});

// Display message create form on GET.
exports.message_create_get = asyncHandler(async function (req, res, next) {
    res.render('create_message_form', {
        title: 'Create Message',
        message: null,
        errors: null,
        layout: 'layout',
    });
});

// Handle message create on POST.
exports.message_create_post = [
    // Validate and sanitize fields
    body('title')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must not be empty and must not be greater than 100 characters.')
        .escape(),
    body('body')
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Body must not be greater than 1000 characters.')
        .escape(),

    // Process request after validation and sanitization
    asyncHandler(async function (req, res, next) {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a message object with escaped and trimmed data.
        const message = new Message({
            title: req.body.title,
            timestamp: Date.now(),
            body: req.body.body,
            user: req.user._id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            res.render('create_message_form', {
                title: 'Create Message',
                message: message,
                errors: errors.array(),
                layout: 'layout',
            });
            return;
        } else {
            // Data from form is valid. Save message.
            await message.save();
            res.redirect('/');
        }
    }),
];

// Handle message delete on POST.
exports.message_delete_post = asyncHandler(async function (req, res) {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Error deleting message."});
    }
});