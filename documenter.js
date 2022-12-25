const Documentation = require("./index");

Documentation.configure({
  keys: {
    openai: "<key>",
    notion: "<key>",
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
    },
    notion: {
      page_id: "<pageid>",
    },
  },
});

Documentation.generateDirectoryTree().then((tree) => {
  let quote = Documentation.getQuote();
  if (quote < 0.5)
    Documentation.document().then((tree) => {
      Documentation.saveDirectoryTree();
      Documentation.saveToNotion(tree);
    });
});
