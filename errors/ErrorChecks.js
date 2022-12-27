const fs = require("fs");
module.exports.Check = {
  IfCanIgnore: (ignore, file_or_folder) => {
    return ignore(file_or_folder);
  },
  IfValidDirectory: (current_route) => {
    try {
      fs.readdirSync(current_route);
    } catch (error) {
      throw "Not a valid route.";
    }
    return;
  },
  IfCanWriteToDirectory: (path, text) => {
    if (path !== null) fs.writeFileSync(path, text);
    else throw "Documenter|Error: directory_tree does not exist.";
  },
  APIRequests: {
    OpenAI: async (request) => {
      try {
        request();
      } catch (error) {
        console.error(error);
      }
      return request();
    },
  },
  IfKeysDefined: (keys) => {
    const { openai, notion } = keys;
    if (openai === undefined || openai === "") {
      throw "Documenter|Error: openai key not defined.";
    } else return keys;
  },
  IfValidConfig: (config) => {
    const { root_folder_path, filter } = config;
    if (filter !== undefined) filter = [];
    if (root_folder_path !== undefined && typeof root_folder_path === "string")
      _static.root_folder_path = root_folder_path;
    else
      throw "Documenter|Error: root_folder_path must be configured as a path string.";
  },
  IfPathFormat: (path) => {
    if (path !== undefined && typeof path === "string") {
      return path;
    } else
      throw "Documenter|Error: root_folder_path must be configured as a path string.";
  },
  IfOpenAIConfigured: (filter) => {
    if (filter?.openai === undefined || filter?.openai.summarize === false)
      throw "";
    else return true;
  },
};

module.exports.Errors = {
  NotConfigured: () => {
    throw "Documenter|Error: Make sure to run .config() first";
  },
  TreeDoesNotExist: () => {
    throw "Documenter|Error: directory_tree does not exist.";
  },
  Notion: {
    MissingSaveData: () => {
      throw "Documenter|Notion|Error: Missing data. Must pass data to .saveToNotion(data).";
    },
  },
};
