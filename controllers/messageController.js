// Import models
const Message = require('../models/message');

// Import async
const asyncHandler = require('express-async-handler');

// Import validator
const { body, validationResult } = require('express-validator');

// Display list of all messages on index page (home page).
exports.index = asyncHandler(async function (req, res, next) {
    const messages = await Message.find()
        .sort({timestamp: 1})
        .populate('user')
        .exec();

    res.render('message_list', {
        title: 'Message Board Home',
        messages: messages,
        layout: 'layout',
    });
});