const formatRuby = require("./ruby");

test("format a basic method", () => {
  let output = formatRuby(`
def hello()
          x = 4
 end`);
  expect(output).toBe("def hello\n  x = 4\n end\n");
});
