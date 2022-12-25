const fs = require("fs");
let _meta = {
  total_tokens: 0,
};
function traverse(current_route, current_directory) {
  let items = null;
  let current_item = null;
  items = fs.readdirSync(current_route);
  for (const item of items) {
    current_item = item;
    if (item === "node_modules" || item === ".next") continue;
    current_directory[item] = {};
    try {
      traverse(current_route + item + "/", current_directory[item]);
    } catch (error) {
      let file_content = fs.readFileSync(current_route + item, {
        encoding: "utf8",
      });
      current_directory[item] = {
        file_name: item,
        number_of_characters: file_content.length,
      };
      _meta.total_tokens += number_of_tokens(
        current_directory[item].number_of_characters
      );
    }
  }
  return current_directory;
}

function number_of_tokens(string) {
  return string / 4;
}
module.exports = (root, object) => {
  let directory_tree = traverse(root, object);
  directory_tree._meta = _meta;
  return directory_tree;
};
