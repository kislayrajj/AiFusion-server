const EXPERT_MODELS = {
    "Drug Info": {
      api: "https://api.fda.gov/drug/label.json",
      queryParam: "search=openfda.generic_name",
      limit: 1,
    },
    "Education Expert": {
      api: "https://en.wikipedia.org/api/rest_v1/page/summary/",
      queryParam: "", 
    },
    "Work Expert": {
      queryParam: "query",
    },
    "News Expert": {
      api: "https://newsapi.org/v2/everything",
      queryParam: "q",
    },
  };
  
  module.exports = EXPERT_MODELS;
  