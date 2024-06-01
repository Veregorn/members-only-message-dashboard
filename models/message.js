const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    timestamp: { type: Date, required: true },
    body: { type: String, max: 1000},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Virtual for message's URL
messageSchema.virtual("url").get(function () {
    return "/messages/" + this._id;
});

// Virtual for message's timestamp
messageSchema.virtual("formatted_timestamp").get(function () {
    return this.timestamp.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
    });
});

// Export model
module.exports = mongoose.model("Message", messageSchema);