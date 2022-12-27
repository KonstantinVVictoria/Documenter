# Documenter.js

@adasuite/documenter is a JavaScript package that allows you to generate and save documentation for a project directory. It provides several methods for configuring the documentation process and saving the generated documentation to various locations.

[Link to Documentation and Showcase](https://www.notion.so/kvictoria/Documenter-9ac4e16b5d24428aa5429ef54b898ad0)

# Installation

To install @adasuite/documenter, you can use npm or yarn:

```js

npm install @adasuite/documenter
```

```js
yarn add @adasuite/documenter
```

To integrate with Notion:

# Usage

To use @adasuite/documenter, you will need to require it in your code:

```js
const Documentation = require("@adasuite/documenter");
```

To integrate it with Notion:

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
   ![alt text](https://lh4.googleusercontent.com/TRM-BqSt_FsMKznuWkUcT8miuDajNG6vdQUaLz35Jppks-tVq_f5xaOE9yWrLibDUhw=w2400)
2. Click "New Integration"
   ![alt text](https://lh5.googleusercontent.com/jOBTufaGLGsI8zK74RnQHGB4ootherTr27oUdnXZAGtNeoiqQLEfbPZBwVh-n0Wfg3o=w2400)
   Name the integration, and, optionally, upload ban image. Then select an Associated workspace for the integration to work under.

3. Change the capabilities of the integration to:
   ![alt text](https://lh5.googleusercontent.com/BhSdD82xoafrrreHy1fz5ONKm5cF8eDvT44DhimXSL1LPyWGvOc-Ok_sGGQ8e4sYVZs=w2400)

4. Save the API key, and pass it to **Documentation.configure({keys:{notion:"key"}})**
   ![alt text](https://lh4.googleusercontent.com/MbF24vtG4ZD16YYRlbfsabcsgLuOAtKuWvs4oSK0jfyvfp3fH6NEC9LoW9D3aX8Yq5g=w2400)

5. Navigate to the page in which you want your documentation to be stored:
   ![alt text](https://lh6.googleusercontent.com/a5MBVzuVaVO5RHog3LjNetSLkC-QOsgws95svMIINrXrXX5M9QoNbDl4YnQyab7-CXs=w2400)

6. Copy the page_id and pass it to **Documentation.configure({filters:{notion:{page_id:"page_id"}}})**
   ![alt text](https://lh5.googleusercontent.com/p9LjLMKlo_fh_BhOf-mOCtLW953Ya5OSiI5ccT4m1INBxv8UFhyccx1XPoh9_Inus_A=w2400)

## Documentation.configure()

You can then use the **Documentation.configure()** method to set various options for the documentation process. The available options are:

**keys** an object containing API keys for OpenAI and Notion.
**root_folder_path:** the root directory for the documentation process.

### filter object

**filter:** an object containing conditions for ignoring certain files or folders and specifying options for summarization and error reporting for OpenAI and Notion.

**filter.ignore: [(file_or_folder)=>{},...]** the ignore property is an array of functions that takes in a name of a folder or file and then returns a conditionals regarding the names. These functions allow you to filter out certain files or folder.

**filter.openai:** the openai property can contain
**openai.summarize = true|false**, which if true will summarize each file.
**openai.listErrors = true|false**, which if true will list all the possible errors in each file.
**openai.customPrompt = (text) => `${text}`** is a function that takes in the contents of a file in the form of a string, and then returns a prompt including the string.

**filter.notion:** the notion property can contain **notion.page_id = string**, which if defined will save the documentation to the page with that page_id.

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
    openai: "<key>",
    notion: "<key>",
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
      page_id: "<page_id>",
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
