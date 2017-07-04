const tmp = require("tmp");
const fs = require("fs");
const prettier = require("prettier");
const child_process = require("child_process");
const path = require("path");

function correctDir(filepath) {
  if (fs.lstatSync(filepath).isDirectory()) {
    fs
      .readdirSync(filepath)
      .filter(filepath =>
        [".md", ".markdown"].includes(path.extname(filepath).toLowerCase())
      )
      .forEach(filepath => correctDir(filepath));
  } else {
    console.log(`Correcting ${filepath}`);
    correctFile(filepath);
  }
}

function correctFile(filepath) {
  markDown = fs.readFileSync(filepath, "utf8");
  fs.writeFileSync(filepath, cleanFile(markDown), "utf8");
}

function cleanFile(content) {
  let newContent = "";
  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlock = "";
  content.split("\n").forEach(line => {
    let lineIsCodeFence = line.startsWith("```");
    if (inCodeBlock && lineIsCodeFence) {
      newContent += prettyCodeBlock(codeBlockLang, codeBlock);
      newContent += line + "\n";
      inCodeBlock = false;
      codeBlockLang = "";
      codeBlock = "";
    } else if (lineIsCodeFence) {
      newContent += line + "\n";
      inCodeBlock = true;
      codeBlockLang = parseCodeFence(line);
    } else if (inCodeBlock) {
      codeBlock += `${line}\n`;
    } else {
      newContent += line + "\n";
    }
  });

  return newContent;
}

function parseCodeFence(line = "") {
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
      let cleanedCode = code;
      const tmpobj = tmp.fileSync({ prefix: "tmp_XXXXXXX", postfix: ".rb" });
      fs.writeFileSync(tmpobj.name, code);
      try {
        child_process.execSync(
          `rubocop -f j --auto-correct --stdin ${tmpobj.name}`,
          { input: code, encoding: "utf8" }
        );
      } catch (error) {
        cleanedCode = error.output[1].split("====================")[1];
      }

      tmpobj.removeCallback();
      return cleanedCode;
    default:
      return code;
  }
}

module.exports = {
  cleanFile,
  correctFile,
  correctDir
};
