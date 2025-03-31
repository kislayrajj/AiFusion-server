const express = require("express");
const { askAI } = require("../services/askAI"); 
const router = express.Router();
const ChatModel = require("../models/Message");

// Save and Get Bot Response
router.post("/sendMessage", async (req, res) => {
  const { message, bot } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  try {
    // Save User Message to Database
    const userMessage = new ChatModel({ sender: "User", message, bot });
    await userMessage.save();

    // Get AI Response
    // const botReplyData = await askAI(message);
    // const botReply = botReplyData?.[0]?.generated_text || "I couldn't process that.";
    const botReply = await askAI(message);  // askAI() already returns a string


    // Save AI Response
    // const botMessage = new ChatModel({ sender: bot, message: botReply, bot });
    // await botMessage.save();
    const botMessage = new ChatModel({ sender: `${bot} AI`, message: botReply, bot });
await botMessage.save();


    // Send response back
    res.json({ botReply });

  } catch (error) {
    console.error("Error processing chat:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Messages for a Specific Bot
router.get("/getMessage", async (req, res) => {
  const { bot } = req.query;
  
  if (!bot) {
    return res.status(400).json({ error: "Bot name is required" });
  }

  try {
    const messages = await ChatModel.find({ bot }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

// Delete a message by ID
router.delete("/deleteMessage/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await ChatModel.findByIdAndDelete(id);
      res.json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
      console.error("Error deleting message:", error.message);
      res.status(500).json({ error: "Error deleting message" });
    }
  });

  router.delete("/clearChat", async (req, res) => {
    const { bot } = req.query;
  
    if (!bot) {
      return res.status(400).json({ error: "Bot name is required" });
    }
  
    try {
      await ChatModel.deleteMany({ bot });  // Delete all messages for the bot
      res.json({ message: "Chat cleared successfully" });
    } catch (error) {
      console.error("Error clearing chat:", error.message);
      res.status(500).json({ error: "Error clearing chat" });
    }
  });
  

module.exports = router;
