const axios = require("axios");
const EXPERT_MODELS = require("../models/expertAiModels");

const getExpertResponse = async (bot, message) => {
  if (!EXPERT_MODELS[bot]) {
    console.error(`Error: No API URL found for expert bot "${bot}"`);
    return "Invalid expert selection.";
  }

  let { api, queryParam, limit } = EXPERT_MODELS[bot];
  let apiUrl = api;

  if (bot === "Drug Info") {
    // Correct OpenFDA query format
    apiUrl += `?search=openfda.generic_name.exact=${encodeURIComponent(message)}`;
  } else if (queryParam) {
    apiUrl += `?${queryParam}=${encodeURIComponent(message)}`;
  }

  if (limit) {
    apiUrl += `&limit=${limit}`;
  }

  try {
    console.log("API Request URL:", apiUrl); // Debugging
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: process.env.EXPERT_API_KEY || "",
        "Content-Type": "application/json",
      },
    });

    let expertResponse = "No relevant information found.";

    if (bot === "Drug Info") {
      const results = response.data.results?.[0];
      if (results) {
        expertResponse = `
          Brand: ${results.openfda?.brand_name?.[0] || "N/A"}
          \nActive Ingredient: ${results.active_ingredients?.[0]?.name || "N/A"}
          \nPurpose: ${results.purpose?.[0] || "N/A"}
          \nWarnings: ${results.warnings?.[0] || "N/A"}
        `;
      } else {
        expertResponse = `No information found for "${message}". Try another name like "Acetaminophen".`;
      }
    } else if (bot === "Education Expert") {
      expertResponse = response.data.extract || "No summary found.";
    } else if (bot === "Work Expert") {
      expertResponse = response.data.advice || "No career advice found.";
    } else if (bot === "News Expert") {
      expertResponse = response.data.articles?.[0]?.title || "No news found.";
    }

    return expertResponse.trim();
  } catch (error) {
    console.error(`Error calling ${bot}:`, error.response?.data || error.message);

    if (error.response?.data?.error?.code === "NOT_FOUND") {
      return `No information found for "${message}". Try another name like "Acetaminophen".`;
    }

    return "Error fetching expert response.";
  }
};

module.exports = { getExpertResponse };
