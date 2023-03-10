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
  customPrompt: customPrompt,
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
      prompt: `Create a short, succinct documentation, listing function interfaces and a summary of the code:\n${text}\nDocumentation:\n`,
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
      prompt: `List the possible errors in the code, and how you might improve it overall:\n${text}\nAnalysis:\n`,
      max_tokens: 700,
      temperature: 0,
      ...(filter.openai.config || {}),
    })
  );

  console.log(
    "Documenter|Open AI|API|List Errors: Query #" +
      ++State.number_of_queries +
      " -- " +
      file_or_folder
  );

  let errors = completion.data.choices[0].text;

  return errors;
}

async function customPrompt(text, filter, file_or_folder) {
  if (!filter.openai.customPrompt) return;
  Check.IfOpenAIConfigured(filter);

  const prompt = filter.openai.customPrompt;
  const completion = await Check.APIRequests.OpenAI(() =>
    _static.openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt(text),
      max_tokens: 700,
      temperature: 0,
      ...(filter.openai.config || {}),
    })
  );

  console.log(
    "Documenter|Open AI|API|List Custom: Query #" +
      ++State.number_of_queries +
      " -- " +
      file_or_folder
  );

  let result = completion.data.choices[0].text;

  return result;
}
module.exports = Interface;
