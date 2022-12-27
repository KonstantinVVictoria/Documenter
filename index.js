const OpenAI = require("./OpenAi/openai");
const Notion = require("./Notion/Notion");
const traverse = require("./algorithms/traverse_directory");
const chalk = require("chalk");
const { Check, Errors } = require("./errors/ErrorChecks");

const _static = {
  keys: {
    openai: "",
    notion: "",
  },
  root_folder_path: "",
};

const State = {};

const Interface = {
  Directory: {},
  configure: configure,
  generateDirectoryTree: () => Errors.NotConfigured(),
  saveDirectoryTree: () => Errors.NotConfigured(),
  document: () => Errors.NotConfigured(),
  getQuote: () => Errors.NotConfigured(),
  getDirectoryTree: () => {
    if (Interface.Directory !== {}) return Interface.Directory;
    else Errors.TreeDoesNotExist();
  },
  saveToNotion: () => Errors.NotConfigured(),
};

function configure({ keys, root_folder_path, filter = {} }) {
  //Check:

  if (filter?.ignore === undefined) filter.ignore = [];
  _static.keys = Check.IfKeysDefined(keys);
  _static.root_folder_path = Check.IfPathFormat(root_folder_path);
  //Initialize:
  if (openAIisInitialized()) OpenAI.initialize({ key: _static.keys.openai });

  if (notionIsInitialized(filter))
    Notion.initialize({
      key: _static.keys.notion,
      page_id: filter.notion.page_id,
    });
  //Build:
  Interface.generateDirectoryTree = async () =>
    await traverse(root_folder_path, Interface.Directory, {
      ...filter,
      openai: {
        summarize: false,
      },
    });

  Interface.document = openAIisInitialized()
    ? async () => await document(filter)
    : Interface.document;

  Interface.getQuote = () => getQuote(Interface.Directory._static.total_tokens);

  Interface.saveDirectoryTree = () =>
    Check.IfCanWriteToDirectory(
      root_folder_path + "/Documentation.json",
      JSON.stringify(Interface.Directory)
    );

  Interface.saveToNotion = notionIsInitialized(filter)
    ? Notion.saveToNotion
    : Interface.saveToNotion;

  return Interface;
}

function getQuote(number_of_tokens) {
  Interface.getDirectoryTree();

  const multiplier = [
    Interface?.filter?.openai?.summarize || true,
    Interface?.filter?.openai?.listErrors || true,
  ].reduce((current_sum, current_value) => current_sum + current_value, 1);

  let numerical_price =
    number_of_tokens * multiplier * (0.02 /*dollars*/ / 1000); /*token*/

  let price_string = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numerical_price);

  console.log(chalk.green("Estimated price is around: " + price_string));

  return numerical_price;
}

async function document(filter) {
  Interface.Directory = await traverse(
    _static.root_folder_path,
    Interface.Directory,
    filter
  );
  return Interface.Directory;
}

function notionIsInitialized(filter) {
  return (
    _static.keys?.notion !== undefined &&
    typeof _static.keys?.notion === "string" &&
    filter?.notion &&
    filter?.notion.page_id
  );
}

function openAIisInitialized() {
  return (
    _static.keys?.openai !== undefined &&
    typeof _static.keys?.openai === "string"
  );
}
module.exports = Interface;
