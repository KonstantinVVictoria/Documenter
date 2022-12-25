const { Configuration, OpenAIApi } = require("openai");
const { Check } = require("../errors/ErrorChecks");
let _static = {
  key: "",
  openai: null,
  number_of_queries: 0,
};

let Interface = {
  summarizeCode: summarizeCode,
  intialize: intialize,
  getKey: () => _static.key,
};

function intialize(config) {
  let { key } = config;
  const configuration = new Configuration({
    apiKey: key,
  });
  _static.openai = new OpenAIApi(configuration);
}

async function summarizeCode(text, filter, file_or_folder) {
  if (filter?.openai === undefined || filter?.openai.summarize === false)
    return "";
  let open_ai_config = filter.openai?.config ? filter.openai.config : {};
  filter.config = filter.config !== undefined ? filter.config : {};
  console.log(
    "Documentor|Open AI: Query #" +
      ++_static.number_of_queries +
      " -- " +
      file_or_folder
  );
  const completion = await Check.APIRequests.OpenAI(() =>
    _static.openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create a short, succint documentation, including function interfaces and a summary of the code:\n${text}\nDocumentation:\n`,
      max_tokens: 700,
      temperature: 0,
      ...open_ai_config,
    })
  );
  let summary = completion.data.choices[0].text;

  return summary;
}

module.exports = Interface;
