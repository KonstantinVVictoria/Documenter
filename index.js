const { Configuration, OpenAIApi } = require("openai");
const traverse = require("./algorithms/traverse_directory");
const chalk = require("chalk");
const fs = require("fs");
let _internal = {
  keys: {
    openai: "",
    notion: "",
  },
  root: "",
  directory: {},
};

let Interface = {
  config: () => {},
  document: () => {
    console.log(
      chalk.red("Documenter|Error: Make sure to run .config() first")
    );
  },
  get_directory_tree: () => {
    if (_internal.directory !== {}) return _internal.directory;
    else
      console.log(
        chalk.red("Documenter|Error: directory_tree does not exist.")
      );
  },
  save_directory_tree: () =>
    console.log(
      chalk.red("Documenter|Error: Make sure to run .config() first")
    ),
  getQuota: () => {
    console.log(
      chalk.red("Documenter|Error: Make sure to run .config() first")
    );
  },
};

Interface.config = function ({ keys, root, filter }) {
  const { openai, notion } = keys;

  if (openai === undefined || openai === "") {
    console.log(chalk.red("Documenter|Error: openai key not defined."));

    return;
  } else if (notion === undefined || notion === "") {
    console.log(chalk.red("Documenter|Error: notion key not defined."));

    return;
  } else {
    _internal.keys = keys;
    Interface.document = () => document({ root, filter });
    _internal.directory = traverse(root, {});
    Interface.getQuota = () => getQuota(_internal.directory._meta.total_tokens);
    Interface.save_directory_tree = save_directory_tree;
    return Interface;
  }
};

function getQuota(number_of_tokens) {
  let numerical_price = number_of_tokens * (0.02 / 1000);
  let price_string = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number_of_tokens * (0.02 / 1000));

  text = console.log(
    chalk.green("Estimated price is at least: " + price_string)
  );
  return numerical_price;
}

function save_directory_tree(path) {
  if (_internal.directory !== {})
    fs.writeFileSync(path, JSON.stringify(_internal.directory));
  else
    console.log(chalk.red("Documenter|Error: directory_tree does not exist."));
}
function document(config) {
  const { root, filter } = config;
  if (root !== undefined && typeof root === "string") _internal.root = root;
  else {
    console.log(
      chalk.red("Documenter|Error: root must be configured as a path string.")
    );
    return;
  }
  if (filter !== undefined) {
    _internal.filter = filter;
  }
}

module.exports = Interface;
