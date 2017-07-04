# Prettier Markdown Codeblocks

[![Build Status](https://travis-ci.org/TIYDC/prettier-markdown-codeblocks.svg?branch=master)](https://travis-ci.org/TIYDC/prettier-markdown-codeblocks)

Format codeblocks in markdown files using [prettier](https://prettier.io/) and [rubocop](https://github.com/bbatsov/rubocop).  

Currently Supports 

- Javascript
- JSON
- Ruby (via rubocop `gem install rubocop`)
- CSS
- SCSS

## Usage

Directory
```sh
prettier-markdown-codeblocks .
```

File
```sh
prettier-markdown-codeblocks prose.md
```

Stdin
```sh
cat prose.md | prettier-markdown-codeblocks | tee prose.md
```

## Contributing

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

Bug reports and pull requests are welcome on GitHub at https://github.com/TIYDC/prettier-markdown-codeblocks. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).