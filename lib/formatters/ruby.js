const fs = require("fs");
const path = require("path");
const tmp = require("tmp");
const shell = require("child_process").execSync;
/**
 * Format a ruby code string with rubocop -a
 * @param {String} code A String of ruby code.
 * @returns {String}
 */
module.exports = function formatRuby(code, filepath) {
  let cleanedCode = code;
  const tmpobj = tmp.fileSync({
    prefix: "tmp_XXXXXXX",
    postfix: ".rb"
  });
  const configPath = findConfigForFilePath(filepath);
  let configOption;

  if (configPath !== null) {
    configOption = `--config ${configPath}`;
  }

  fs.writeFileSync(tmpobj.name, code);
  try {
    shell(
      `rubocop -f j ${configOption} --auto-correct --stdin ${tmpobj.name}`,
      {
        input: code,
        encoding: "utf8"
      }
    );
  } catch (error) {
    // A corrected file will return exit code 1, if rubocop is not present 127.

    if (error.status === 1) {
      cleanedCode =
        error.output[1].split("====================")[1].trim() + "\n";
    }
  }

  tmpobj.removeCallback();
  return cleanedCode;
};

function findConfigForFilePath(filepath) {
  const configPath = path.join(path.dirname(filepath), ".rubocop.yml");
  if (fs.existsSync(configPath)) {
    return configPath;
  } else {
    if (path.dirname(filepath) === "/") {
      return null;
    }
    findConfigForFilePath(path.dirname(filepath));
  }
}
