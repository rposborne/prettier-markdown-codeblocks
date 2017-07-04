const tmp = require("tmp");
const fs = require("fs");
const prettier = require("prettier");
const child_process = require("child_process");
const path = require("path");
const formatRuby = require("./formatters/ruby");

module.exports = {
  extractCodeBlocks,
  correctString,
  correctFile,
  correctDir
};

function correctDir(filepath) {
  if (fs.lstatSync(filepath).isDirectory()) {
    fs
      .readdirSync(filepath)
      .filter(filepath =>
        [".md", ".markdown"].includes(path.extname(filepath).toLowerCase())
      )
      .forEach(filepath => correctDir(filepath));
  } else {
    correctFile(filepath);
  }
}

function correctString(string) {
  return extractCodeBlocks(string, (lang, code) => prettyCodeBlock(lang, code));
}

function correctFile(filepath) {
  console.log(`Correcting Markdown Code Blocks for ${filepath}`)
  markDown = fs.readFileSync(filepath, "utf8");
  fs.writeFileSync(filepath, correctString(markDown), "utf8");
}

function extractCodeBlocks(content, contentHandler) {
  let newContent = "";
  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlock = "";
  content.split("\n").forEach(line => {
    let lineIsCodeFence = line.startsWith("```");
    if (inCodeBlock && lineIsCodeFence) {
      newContent += contentHandler(codeBlockLang, codeBlock);
      newContent += `${line}\n`;
      inCodeBlock = false;
      codeBlockLang = "";
      codeBlock = "";
    } else if (lineIsCodeFence) {
      newContent += `${line}\n`;
      inCodeBlock = true;
      codeBlockLang = parseCodeFenceLang(line);
    } else if (inCodeBlock) {
      codeBlock += `${line}\n`;
    } else {
      newContent += `${line}\n`;
    }
  });

  return newContent.trim() + "\n";
}

function parseCodeFenceLang(line = "") {
  return line.slice(3).split(" ")[0];
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
    case "rb":
    case "ruby":
      return formatRuby(code);
    default:
      return code;
  }
}
