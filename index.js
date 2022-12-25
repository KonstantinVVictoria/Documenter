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

let Interface = {
  configure: configure,
  document: () => Errors.NotConfgured(),
  generateDirectoryTree: () => Errors.NotConfgured(),
  saveDirectoryTree: () => Errors.NotConfgured(),
  getQuote: () => Errors.NotConfgured(),
  saveToNotion: () => Errors.NotConfgured(),
  Directory: {},
  getDirectoryTree: () => {
    if (Interface.Directory !== {}) return Interface.Directory;
    else Errors.TreeDoesNotExist();
  },
};

function configure({ keys, root_folder_path, filter }) {
  //Check:
  if (filter === undefined) filter = [];
  _static.keys = Check.IfKeysDefined(keys);
  _static.root_folder_path = Check.IfPathFormat(root_folder_path);
  //Initialize:
  OpenAI.intialize({ key: _static.keys.openai });
  if (
    _static.keys?.notion !== undefined &&
    typeof _static.keys?.notion === "string" &&
    filter?.notion &&
    filter?.notion.page_id
  )
    Notion.intialize({
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
  Interface.document = async () => await document(filter);
  Interface.getQuote = () => getQuote(Interface.Directory._static.total_tokens);
  Interface.saveDirectoryTree = () =>
    Check.IfCanWriteToDirectory(
      root_folder_path + "/Documenation.json",
      JSON.stringify(Interface.Directory)
    );
  Interface.saveToNotion = _static.keys?.notion
    ? Notion.saveToNotion
    : Interface.saveToNotion;
  return Interface;
}

function getQuote(number_of_tokens) {
  Interface.getDirectoryTree();
  let numerical_price =
    number_of_tokens * 2 * (0.02 /*dollars*/ / 1000); /*token*/

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

module.exports = Interface;
