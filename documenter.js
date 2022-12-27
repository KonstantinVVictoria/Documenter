require("dotenv").config();
const Documentation = require("./index");

Documentation.configure({
  keys: {
    openai: process.env.OPENAI_KEY,
    notion: process.env.NOTION_KEY,
  },
  root_folder_path: "./",
  filter: {
    ignore: [
      (file_or_folder) =>
        file_or_folder === "node_modules" ||
        file_or_folder === ".vscode" ||
        file_or_folder === ".git" ||
        file_or_folder === ".gitignore" ||
        file_or_folder === "README.md",
      (file_or_folder) => file_or_folder.search(".json") !== -1,
    ],
    openai: {
      summarize: true,
      listErrors: true,
    },
    notion: {
      page_id: "9ac4e16b5d24428aa5429ef54b898ad0",
    },
  },
});

Documentation.generateDirectoryTree().then((tree) => {
  let quote = Documentation.getQuote(); //In Dollars;
  if (quote < /*$*/ 0.5)
    Documentation.document().then((tree) => {
      Documentation.saveDirectoryTree();
      Documentation.saveToNotion(tree);
    });
});
