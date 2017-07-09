const fs = require("fs");
const prettier = require("prettier");
const eslintFormat = require("prettier-eslint");
const path = require("path");
const formatRuby = require("./formatters/ruby");

module.exports = {
  extractCodeBlocks,
  correctString,
  correctFile,
  correctDir
};

/**
 * AutoCorrect all files ending in .md and .markdown in a given directory.
 *
 * @param {String} filepath
 */
function correctDir(filepath) {
  filepath = path.resolve(filepath);
  if (fs.lstatSync(filepath).isDirectory()) {
    fs
      .readdirSync(filepath)
      .forEach(p => correctDir(path.resolve(path.join(filepath, p))));
  } else {
    if ([".md", ".markdown"].includes(path.extname(filepath).toLowerCase())) {
      correctFile(filepath);
    }
  }
}

/**
 * Correct a given markdown string's code blocks.
 *
 * @param {String} string
 * @returns {String}
 */
function correctString(string, filepath = process.cwd()) {
  return extractCodeBlocks(string, (lang, code) =>
    formatCodeBlock(lang, code, filepath)
  );
}

/**
 * Correct a markdown file at a given filepath's code blocks.
 *
 * @param {String} filepath
 */
function correctFile(filepath) {
  console.log(`Correcting Markdown Code Blocks for ${filepath}`);
  markDown = fs.readFileSync(filepath, "utf8");
  fs.writeFileSync(filepath, correctString(markDown, filepath), "utf8");
}

/**
 * Callback used by extractCodeBlocks.
 * @callback extractCodeBlocks~contentHandler => String
 * @param {String} Lang
 * @param {String} Code
 * @retursn {String} Formatted code.
 */

/**
 * Extract code inside of fences and pass them to contentHandler.
 *
 * @param {String} content
 * @param {Function} contentHandler
 * @returns {String} markdown with formatted code.
 */
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

/**
 * Extract the language of a given code block from it's code fence.
 *
 * @param {String} line
 * @returns {String}
 */
function parseCodeFenceLang(line) {
  return parseCodeFence(line)[0];
}

function parseCodeFence(line) {
  return line.slice(3).split(" ").map(el => el.trim());
}

/**
 * Take a given block of code and format it accorording to the passed in language.
 *
 * @param {String} lang
 * @param {String} code
 * @returns {String} formatted code block
 */
function formatCodeBlock(lang, code, filepath) {
  try {
    switch (lang) {
      case "js":
      case "javascript":
        return eslintFormat({
          text: code,
          filePath: filepath
        });
      case "json":
        return prettier.format(code, { parser: "json" });
      case "css":
      case "scss":
      case "less":
        return prettier.format(code, { parser: "postcss" });
      case "rb":
      case "ruby":
        return formatRuby(code, filepath);
      case "graphql":
        return prettier.format(code, { parser: "graphql" });
      case "ts":
        return prettier.format(code, { parser: "typescript" });
      default:
        return code;
    }
  } catch (error) {
    console.error(error);
    return code;
  }
}
