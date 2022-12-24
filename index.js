const { Configuration, OpenAIApi } = require("openai");
const chalk = require("chalk");
let _internal = {
  keys: {
    openai: "",
    notion: "",
  },
};

let Interface = {};

Interface.config = function ({ openai_key, notion_key }) {
  if (openai_key === undefined || openai_key === "") {
    console.log(chalk.red("Documenter|Error: openai_key not defined."));
  } else if (notion_key === undefined || notion_key === "") {
    console.log(chalk.red("Documenter|Error: notion_key not defined."));
  } else {
    _internal.keys.openai = openai_key;
    _internal.keys.notion = notion_key;
  }
};

const Documenter = () => {
  return;
};
