const { Check } = require("../errors/ErrorChecks");
const OpenAI = require("../OpenAi/openai");
const fs = require("fs");
let _static = {
  total_tokens: 0,
};

let Interface = async (root_folder, object, filter) => {
  let directory_tree = await traverse(
    root_folder,
    object,
    filter,
    fs.readdirSync(root_folder)
  );
  directory_tree._static = _static;
  return directory_tree;
};

async function traverse(
  current_path,
  current_directory,
  filter,
  directory_children = []
) {
  const how_to_ignore = filter?.ignore;
  for (const file_or_folder of directory_children) {
    if (should_ignore(file_or_folder, how_to_ignore)) continue;

    try {
      let children = fs.readdirSync(current_path + file_or_folder + "/");
      current_directory[file_or_folder + "/"] = {};
      await traverse(
        current_path + file_or_folder + "/",
        current_directory[file_or_folder + "/"],
        filter,
        children
      );
    } catch (error) {
      let file_content = fs.readFileSync(
        Check.IfPathFormat(current_path + file_or_folder),
        {
          encoding: "utf8",
        }
      );
      current_directory[file_or_folder] = {
        file_name: file_or_folder,
        number_of_characters: file_content.length,
        summary: await OpenAI.summarizeCode(
          file_content,
          filter,
          file_or_folder
        ),
        path: current_path + file_or_folder,
      };
      _static.total_tokens += number_of_tokens(
        current_directory[file_or_folder].number_of_characters
      );
    }
  }

  return current_directory;
}

function should_ignore(file_or_folder, ignore_functions) {
  if (ignore_functions === undefined) return false;
  for (const ignore of ignore_functions) {
    if (Check.IfCanIgnore(ignore, file_or_folder)) {
      return true;
    }
  }
  return false;
}

function number_of_tokens(string) {
  return string / 4;
}
module.exports = Interface;
