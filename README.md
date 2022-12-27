# Documenter.js

@adasuite/documenter is a JavaScript package that allows you to generate and save documentation for a project directory. It provides several methods for configuring the documentation process and saving the generated documentation to various locations.

# Installation

To install @adasuite/documenter, you can use npm or yarn:

```js

npm install @adasuite/documenter
```

```js
yarn add @adasuite/documenter
```

# Usage

To use @adasuite/documenter, you will need to require it in your code:

```js
const Documentation = require("@adasuite/documenter");
```

## Documentation.configure()

You can then use the **Documentation.configure()** method to set various options for the documentation process. The available options are:

**keys** an object containing API keys for OpenAI and Notion.
**root_folder_path:** the root directory for the documentation process.
**filter:** an object containing conditions for ignoring certain files or folders and specifying options for summarization and error reporting for OpenAI and Notion.

## Documentation.generateDirectoryTree()

Once you have configured the documentation process, you can generate the documentation using the **Documentation.generateDirectoryTree()** method. This method generates a tree structure representing the directory of the project.

## Documentation.getQuote()

You can retrieve a quote for the documentation process in dollars using the _Documentation.getQuote()_ method. You can use this method to prevent the document process if it goes over a set budget.

## Documentation.document() method.

This method returns a promise that resolves with the generated documentation.

## Documentation.saveDirectoryTree() and Documentation.saveToNotion()

Finally, you can save the generated documentation using the **Documentation.saveDirectoryTree()** method and **Documentation.saveToNotion()** method, which saves the documentation to a specified page in Notion.

## Example

Here is an example of how you might use _@adasuite/documenter_ in your code:

In **root_folder/documenter.js:**

```js
const Documentation = require("@adasuite/documenter");

Documentation.configure({
  keys: {
    openai: "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",
    notion: "secret_6XtiJrubZQ6zvBPlck8sZcSoalCACNv99bEL3v8eKkM",
  },
  root_folder_path: "./",
  filter: {
    ignore: [
      (file_or_folder) => {
        return (
          file_or_folder === "node_modules" ||
          file_or_folder === ".next" ||
          file_or_folder === "styles" ||
          file_or_folder === ".gitignore" ||
          file_or_folder === "next.config.js" ||
          file_or_folder === "package-lock.json" ||
          file_or_folder === "package.json" ||
          file_or_folder === ".babelrc" ||
          file_or_folder === ".eslintrc.json" ||
          file_or_folder === ".git" ||
          (file_or_folder.indexOf(".") !== -1 &&
            file_or_folder.indexOf(".js") === -1) ||
          file_or_folder.indexOf(".json") !== -1
        );
      },
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
  Documentation.saveDirectoryTree();
  if (quote < /*$*/ 0.5)
    Documentation.document().then((tree) => {
      Documentation.saveDirectoryTree();
      Documentation.saveToNotion(tree);
    });
});
```

This code configures the documentation process with the specified options, generates the documentation, and saves it to the specified page in Notion if the quote is less than $0.5.

## Note

It is important to note that the @adasuite/documenter package requires API keys for OpenAI and Notion to be used. These keys are not provided with the package and must be obtained separately. Please refer to the documentation for OpenAI and Notion for more information on how to obtain these keys.
