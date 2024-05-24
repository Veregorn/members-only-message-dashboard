// Import models
const Message = require('../models/message');

// Import async
const asyncHandler = require('express-async-handler');

// Import validator
const { body, validationResult } = require('express-validator');

// Display list of all messages on index page (home page).
exports.index = asyncHandler(async function (req, res, next) {
    const messages = await Message.find().populate('user').exec();
    res.render('index', { title: 'Message Board Home', messages: messages });
});