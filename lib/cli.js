const pmc = require("../lib/prettier-markdown-codeblocks");
const usage = require("../lib/usage");

/**
 * 
 * 
 * @param {Array} argv 
 */
module.exports = function cli(args) {
  const path = args[2];

  if (path === "-h" || path === "--help") {
    console.log(usage);
  } else if (path) {
    pmc.correctDir(path);
  } else {
    handlePipe();
  }

  function handlePipe() {
    let markDown = "";
    var readline = require("readline");
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on("line", line => {
      markDown += `${line}\n`;
    });

    rl.on("close", () => {
      process.stdout.write(pmc.correctString(markDown));
    });
  }
};
