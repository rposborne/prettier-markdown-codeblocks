const cli = require("./cli");
const fs = require("fs");
const path = require("path");
const tmp = require("tmp");
const shell = require("child_process").execSync;

function setupTempProject() {
  const tmpDir = tmp.dirSync({ unsafeCleanup: true });
  const src = path.resolve("tests/fixtures/fake_project/");
  shell(`cp -R ${src} ${tmpDir.name}`);
  return tmpDir;
}

test("will alter all files in directory", () => {
  const tmpDir = setupTempProject();
  let output = cli([null, null, tmpDir.name]);
  tmpDir.removeCallback();
});

test("will alter one file path", () => {
  const tmpDir = setupTempProject();
  const path = `${tmpDir.name}/fake_project/ruby.md`;
  cli([null, null, path]);

  const output = fs.readFileSync(path, "utf8");
  expect(output).toBe('```ruby\ndef hello\n  puts "Hello world"\nend\n```\n');
  tmpDir.removeCallback();
});
