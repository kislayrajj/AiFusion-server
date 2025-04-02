const express = require("express");
const { getExpertResponse } = require("../services/getExpertResponse");
const router = express.Router();
const Message = require("../models/Message"); 

router.post("/sendMessage", async (req, res) => {
    const { message, bot } = req.body;

    if (!message || !bot) {
        return res.status(400).json({ error: "Message and bot name are required" });
    }

    try {
        // Get AI response
        const response = await getExpertResponse(bot, message);

        // Save user message
        const userMessage = new Message({
            sender: "User",
            message: message,
            expert: bot,
        });
        await userMessage.save();

        // Save bot response
        const botMessage = new Message({
            sender: bot, // Name of expert
            message: response,
            expert: bot,
        });
        await botMessage.save();

        res.json({ response });
    } catch (error) {
        console.error("Error processing message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
