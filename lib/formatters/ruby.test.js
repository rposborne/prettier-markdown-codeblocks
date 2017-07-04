const formatRuby = require('./ruby');

test('format a basic method', () => {
    let output = formatRuby(`
    def hello()
     end`)
    expect(output).toBe("def hello; end");
});