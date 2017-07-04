const fs = require("fs");
const tmp = require("tmp");
const child_process = require("child_process");
/**
 * Format a ruby code string with rubocop -a
 * @param {String} code A String of ruby code.
 * @returns {String}
 */
module.exports = function formatRuby(code) {
  let cleanedCode = code;
  const tmpobj = tmp.fileSync({
    prefix: "tmp_XXXXXXX",
    postfix: ".rb"
  });
  fs.writeFileSync(tmpobj.name, code);
  try {
    child_process.execSync(
      `rubocop -f j --auto-correct --stdin ${tmpobj.name}`,
      {
        input: code,
        encoding: "utf8"
      }
    );
  } catch (error) {
    // A corrected file will return exit code 1, if rubocop is not present 127.
    if (error.status === 1) {
      cleanedCode = error.output[1].split("====================")[1].trim();
    }
  }

  tmpobj.removeCallback();
  return cleanedCode;
};
