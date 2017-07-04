const getUsage = require("command-line-usage");

const sections = [
  {
    header: "Prettier Markdown Codeblocks",
    content: "Autoformat code blocks in markdown files."
  },
  {
    header: "Synopsis",
    content: [
      "$ prettier-markdown-codeblocks [[bold]{<directory>}]",
      "$ prettier-markdown-codeblocks [[bold]{<file>}]",
      "$ prettier-markdown-codeblocks "
    ]
  },
  {
    header: "Options",
    content: [{ name: "--help", summary: "Display this guide" }]
  },
  {
    content:
      "Project home: [underline]{https://github.com/TIYDC/prettier-markdown-codeblocks}"
  }
];
module.exports = getUsage(sections);
