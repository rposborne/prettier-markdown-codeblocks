const prettier = require("prettier");

function cleanFile(content) {
  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlock = "";
  content.split("\n").forEach(line => {
    let lineIsCodeFence = line.startsWith("```");
    if (inCodeBlock && lineIsCodeFence) {
      process.stdout.write(prettyCodeBlock(codeBlockLang, codeBlock));
      process.stdout.write(line + "\n");
      inCodeBlock = false;
      codeBlockLang = "";
      codeBlock = "";
    } else if (lineIsCodeFence) {
      process.stdout.write(line + "\n");
      inCodeBlock = true;
      codeBlockLang = parseCodeFence(line);
    } else if (inCodeBlock) {
      codeBlock += `${line}\n`;
    } else {
      process.stdout.write(line + "\n");
    }
  });
}

function parseCodeFence(line = "") {
  return line.slice(3, -1).split(" ")[0];
}

function prettyCodeBlock(lang, code) {
  switch (lang) {
    case "js":
    case "javascript":
      return prettier.format(code);
    case "cs":
    case "css":
    case "scss":
      return prettier.format(code, { parser: "postcss" });
    default:
      return code;
  }
}

module.exports = {
    cleanFile
}