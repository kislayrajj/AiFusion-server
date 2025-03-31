const ChatModel = require("./../models/Message")
const { getAIResponse } = require("../services/askAI");

const sendMessage = async (req, res) => {
    const { message, bot } = req.body;

    if (!message?.trim()) {
        return res.status(400).json({ error: "Message cannot be empty" });
    }

    try {
        // ✅ Save User Message
        const userMessage = new ChatModel({ sender: "User", message, bot });
        await userMessage.save();

        // ✅ Get AI response based on bot type
        const botReply = await getAIResponse(bot, message);

        // ✅ Save AI Response
        const botMessage = new ChatModel({ sender: bot, message: botReply, bot });
        await botMessage.save();

        console.log("📩 Saved Messages: ", { userMessage, botMessage });

        res.json({ botReply });

    } catch (error) {
        console.error("❌ Error processing chat:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

  
  const getMessage = async (req, res) => {
    const { bot } = req.query;
  
    if (!bot) {
      return res.status(400).json({ error: "Bot name is required" });
    }
  
    try {
      const messages = await ChatModel.find({ bot }).sort({ timestamp: 1 });
  
      console.log("Fetched Messages from DB:", messages);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
      res.status(500).json({ error: "Error fetching messages" });
    }
  };
  
  module.exports = { sendMessage, getMessage };