const { getExpertResponse } = require("./../services/getExpertResponse");

const sendMessage = async (req, res) => {
  const { message, expert } = req.body;

  if (!message || !expert) {
    return res.status(400).json({ error: "Message and expert title are required." });
  }

  try {
    const expertReply = await getExpertResponse(expert, message);
    return res.json({ expertReply });
  } catch (error) {
    console.error("Error in sending message:", error);
    return res.status(500).json({ error: "Failed to process expert response." });
  }
};



module.exports = {
  sendMessage,
};
