const { Client } = require("@notionhq/client");
const { Check } = require("../errors/ErrorChecks");
const fs = require("fs");
let _static = {
  key: "",
  Notion: null,
  page_id: null,
};

let Interface = {
  saveToNotion: async (data) => {
    await traverse(data, _static.page_id);
    console.log("Saved to Notion Successfully");
  },
  intialize: intialize,
  getKey: () => _static.key,
};

function intialize(config) {
  let { key, page_id } = config;

  _static.Notion = new Client({
    auth: key,
  });
  _static.page_id = page_id;
}

async function createPage(props) {
  const { parent_id, body } = props;
  const { title, children, icon } = body;
  const response = await _static.Notion.pages.create({
    parent: {
      type: "page_id",
      page_id: parent_id,
    },
    icon: {
      type: "emoji",
      emoji: icon,
    },
    properties: {
      title: {
        title: [
          {
            type: "text",
            text: {
              content: `${title}`,
            },
          },
        ],
      },
    },
    children: children,
  });
  return response;
}

function Heading(text) {
  return {
    type: "heading_1",
    heading_1: {
      rich_text: [
        {
          type: "text",
          text: {
            content: text,
            link: null,
          },
        },
      ],
      color: "default",
      is_toggleable: false,
    },
  };
}

function Paragraph(text) {
  return {
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: {
            content: text,
            link: null,
          },
        },
      ],
      color: "default",
    },
  };
}

function CodeBlock(code) {
  return {
    type: "code",
    //...other keys excluded
    code: {
      rich_text: [
        {
          type: "text",
          text: {
            content: code,
          },
        },
      ],
      language: "plain text",
    },
  };
}
async function traverse(jsonObj, parent_id) {
  if (jsonObj !== null && typeof jsonObj == "object") {
    for (const [key, value] of Object.entries(jsonObj)) {
      if (key === "_static") continue;
      if (key.search("/") !== -1) {
        let parent = (
          await createPage({
            parent_id: parent_id,
            body: { title: key, icon: "📂" },
          })
        ).id;

        traverse(value, parent);
      } else {
        const children = [];
        let code = null;

        try {
          code = fs.readFileSync(Check.IfPathFormat(value.path), {
            encoding: "utf8",
          });
        } catch (error) {
          console.error(error);
        }

        if (value?.summary && typeof value.summary === "string") {
          children.push(Heading("Summary"));
          children.push(Paragraph(value.summary));
        }

        await createPage({
          parent_id: parent_id,
          body: {
            title: key,
            children: children,
            icon: "📜",
          },
        });
      }
      // key is either an array index or object key
    }
  } else {
    // jsonObj is a number or string
  }
}
module.exports = Interface;
