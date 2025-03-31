const axios = require("axios");

const AI_MODELS = {
  "Mistral AI":
    "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
  "LLaMA 2": "https://api.together.xyz/v1/chat/completions",
  "Gemma AI": "https://api-inference.huggingface.co/models/google/gemma-7b",
  "GPT-2": "https://api-inference.huggingface.co/models/gpt2",
  "GPT-Neo":
    "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B",
};

const getAIResponse = async (bot, message) => {
  const botKey = Object.keys(AI_MODELS).find(
    (key) => key.toLowerCase() === bot.toLowerCase()
  );

  if (!botKey) {
    console.error(`Error: No API URL found for bot "${bot}"`);
    return "Invalid bot selection.";
  }

  const apiUrl = AI_MODELS[botKey];

  const LLaMA_MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free";

  const requestData =
    botKey === "LLaMA 2"
      ? { model: LLaMA_MODEL, messages: [{ role: "user", content: message }] }
      : {
          inputs: `User: ${message}\nAI:`,
          parameters: {
            max_new_tokens: 50,
            temperature: 0.7,
            stop: ["\nUser:", "\nAI:"],
          },
        };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        Authorization: `Bearer ${
          botKey === "LLaMA 2"
            ? process.env.TOGETHERAI_KEY
            : process.env.HUGGINGFACE_KEY
        }`,
        "Content-Type": "application/json",
      },
    });

    console.log(
      `Raw AI Response for ${bot}:`,
      JSON.stringify(response.data, null, 2)
    );

    let aiResponse = "I couldn't process that.";
    if (botKey === "LLaMA 2") {
      aiResponse =
        response.data?.choices?.[0]?.message?.content?.trim() || aiResponse;
    } else {
      const fullResponse =
        response.data?.[0]?.generated_text?.trim() || aiResponse;
      aiResponse = fullResponse.split("AI:")[1]?.trim() || fullResponse;
    }

    return aiResponse;
  } catch (error) {
    console.error(
      `Error calling ${bot}:`,
      error.response?.data || error.message
    );
    return "Error processing request.";
  }
};

module.exports = { getAIResponse };
