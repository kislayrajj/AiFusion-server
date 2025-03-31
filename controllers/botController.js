const openAiService = require("./../services/openAiService")

const askAI = async (req, res) => {
  const { message } = req.body;
  const response = await openAiService.askAI(message);
  res.json({ botReply: response });
};

module.exports = { askAI };
