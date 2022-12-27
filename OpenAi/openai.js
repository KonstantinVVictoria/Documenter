const { Configuration, OpenAIApi } = require("openai");
const { Check } = require("../errors/ErrorChecks");

const _static = {
  key: "",
  openai: null,
};

const State = { number_of_queries: 0 };

const Interface = {
  initialize: initialize,
  summarizeCode: summarizeCode,
  getKey: () => _static.key,
  listErrors: listErrors,
};

function initialize(config) {
  let { key } = config;
  const configuration = new Configuration({
    apiKey: key,
  });
  _static.openai = new OpenAIApi(configuration);
}

async function summarizeCode(text, filter, file_or_folder) {
  if (!filter.openai.summarize) return;

  Check.IfOpenAIConfigured(filter);

  const completion = await Check.APIRequests.OpenAI(() =>
    _static.openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create a short, succinct documentation, including function interfaces and a summary of the code:\n${text}\nDocumentation:\n`,
      max_tokens: 700,
      temperature: 0,
      ...(filter.openai.config || {}),
    })
  );

  console.log(
    "Documenter|Open AI|API|Summary: Query #" +
      ++State.number_of_queries +
      " -- " +
      file_or_folder
  );

  let summary = completion.data.choices[0].text;

  return summary;
}

async function listErrors(text, filter, file_or_folder) {
  if (!filter.openai.listErrors) return;
  Check.IfOpenAIConfigured(filter);

  const completion = await Check.APIRequests.OpenAI(() =>
    _static.openai.createCompletion({
      model: "text-davinci-003",
      prompt: `List possible errors in the code, and how you might improve it:\n${text}\nAnalysis:\n`,
      max_tokens: 700,
      temperature: 0,
      ...(filter.openai.config || {}),
    })
  );

  console.log(
    "Documentor|Open AI|API|List Errors: Query #" +
      ++State.number_of_queries +
      " -- " +
      file_or_folder
  );

  let summary = completion.data.choices[0].text;

  return summary;
}
module.exports = Interface;
