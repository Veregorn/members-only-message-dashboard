const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, max: 100},
    last_name: { type: String, required: true, max: 100},
    username: { type: String, required: true, max: 100 }, 
    password: { type: String, required: true, max: 30},
    status: {
        type: String,
        required: true,
        enum: ["newby", "member", "admin"],
    },
});

// Virtual for user's full name
userSchema.virtual("full_name").get(function () {
    return this.first_name + " " + this.last_name;
});

// Virtual for user's URL
userSchema.virtual("url").get(function () {
    return "/users/" + this._id;
});

// Export model
module.exports = mongoose.model("User", userSchema);