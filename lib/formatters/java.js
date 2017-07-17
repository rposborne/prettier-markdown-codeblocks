const fs = require("fs");
const path = require("path");
const tmp = require("tmp");
const shell = require("child_process").execSync;
// TODO: This should be more dynamic.
const FORMATTER_PATH =
  "/Applications/IntelliJ\\ IDEA\\ CE.app/Contents/bin/format.sh";
const CONFIG_FILE_NAME = ".WEDONTKNOWYET.xml";
/**
 * Format a Java code string with rubocop -a
 * @param {String} code A String of Java code.
 * @returns {String}
 */
module.exports = function formatJava(code, filepath) {
  let cleanedCode = code;

  const tmpobj = tmp.fileSync({
    prefix: "tmp_XXXXXXX",
    postfix: ".java"
  });
  const configPath = findConfigForFilePath(filepath);
  const configOption = configPath ? `-settings ${configPath}` : "";

  fs.writeFileSync(tmpobj.name, code);
  try {
    const shellCommand = `${FORMATTER_PATH} ${configOption} ${tmpobj.name}`;

    shell(shellCommand, {
      input: code,
      encoding: "utf8"
    });
  } catch (error) {
    // A corrected file will return exit code 1, if rubocop is not present 127.
    console.log(error.status);
    console.log(error.output);
    
    if (error.status === 0) {
      cleanedCode = fs.readFileSync(tmpobj.name);
    }
  }

  tmpobj.removeCallback();
  return cleanedCode;
};

function findConfigForFilePath(filepath) {
  if (!filepath) {
    return null;
  }

  const configPath = path.join(path.dirname(filepath), CONFIG_FILE_NAME);
  if (fs.existsSync(configPath)) {
    return configPath;
  } else {
    if (path.dirname(filepath) === "/") {
      return null;
    }
    return findConfigForFilePath(path.dirname(filepath));
  }
}
