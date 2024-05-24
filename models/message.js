const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    timestamp: { type: Date, required: true },
    body: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Virtual for message's URL
messageSchema.virtual("url").get(function () {
    return "/messages/" + this._id;
});

// Export model
module.exports = mongoose.model("Message", messageSchema);