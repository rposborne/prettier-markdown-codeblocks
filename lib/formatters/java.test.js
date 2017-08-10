const formatJava = require("./java");

test("format a basic method", () => {
  let output = formatJava(`
package com.theironyard;

public class Main {

    public static void main(String[] args) {
            System.out.print(args);
    }
}`);
  expect(output).toBe("package com.theironyard;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.print(args);\n     }\n}\n");
});
