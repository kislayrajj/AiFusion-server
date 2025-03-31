const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: String,  // "User" or bot name
    message: String, 
    bot: String,     // Identify which bot the message belongs to
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
