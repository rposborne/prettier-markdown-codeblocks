const pmc = require("./prettier-markdown-codeblocks");
const fs = require("fs");
const path = require("path");

const fixture = name =>
  fs.readFileSync(path.resolve(`./tests/fixtures/${name}`), "utf8");

test("will not alter non code text", () => {
  let output = pmc.correctString(fixture("simple.md"));
  expect(output).toBe(fixture("simple.md"));
});

test("will format json", () => {
  let output = pmc.correctString(fixture("json.md"));
  expect(output).toBe('```json\n{ "hi": "bye" }\n```\n');
});

test("will format css", () => {
  let output = pmc.correctString(fixture("css.md"));
  expect(output).toBe("```css\nh1 {\n  color: white;\n}\n```\n");
});

test("will format js", () => {
  let output = pmc.correctString(fixture("js.md"));
  expect(output).toBe("```js\ne => console.log(e);\n```\n");
});

test("will format accorording to eslint config", () => {
  let output = pmc.correctString(
    fixture("fake_project/eslint.md"),
    path.resolve(`./tests/fixtures/fake_project/eslint.md`)
  );
  expect(output).toBe("```js\ne => console.log(e)\n1 + 1\n```\n");
});
