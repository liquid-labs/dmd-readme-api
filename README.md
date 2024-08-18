# dmd-readme-api

A [jsdoc2md](https://github.com/jsdoc2md/jsdoc-to-markdown) template plugin generating elegant, compact one-page APIs in markdown, suitable for embedding in a `README.md`.

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Formatting ptions](#formatting-options)
- [Examples](#examples)
- [History](#history])
- [Contributing](#contributing)
- [Support](#support)

## Installation

```bash
npm i --save-dev dmd-readme-api jsdoc-to-markdown
```

## Usage

```bash
npx jsdoc2md \
    --configure ./jsdoc.config.json \
    --files 'src/**/*' \
    --global-index-format list \
    --name-format \
    --plugin dmd-readme-api \
    --no-cache
```

You must specify `--plugin` even if it's specified in the `jsdoc.config.json` See below for further details on plugin and `jsdoc.config.json` setting and refer to the [formatting options](#formatting-options) section for additional options.

`jsdoc.config.json`:
```json
{
    "plugins": ["dmd-readme-api"],
    "recurseDepth": 10,
    "source": {
        "includePattern": ".+\\.(c|m)?js(doc|x)?$",
        "excludePattern": "((^|\\/|\\\\)_|.+\\.test\\.(c|m)?jsx?$)"
    },
    "sourceType": "module",
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc","closure"]
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false
    }
}
```

Note that jsdoc2md doesn't do anything with this file. It's passed through to `jsdoc`. Some important notes:

- jsdoc2md and jsdoc don't seem to be fully integrated at this point; the 'plugins' here is ignored by jsdoc2md.
- You need to `tags.allowUnknownTags` `true` or you won't get support for the handy jsdoc2md `@category` tag (and a few others).
- If you want to pick up `.mjs` and `.cjs` files, you must override `source.encludePattern`. How this works is that jsdoc2md will read in everything matched by the `--files` (or `"files"` in `.jsdoc2md.config.json`) and then apply the include and exclude patterns defined in `jsdoc.config.json`.
- The `templates` are effectively ignored currently and are shown here with their default values.
- The `no-cache` avoids erroneously using previous renderings even when settings have changed. Rendering is fast enough that it's not really worthwhile to have the cache enabled as it can cause problems.

## Features

__Extended syntax__:
- You can `@hide` or `@ignore` function parameters in the documentation; see [hide parameters](#hide-parameters).

__New options__:
- Adds configurable section title to main output; see the [title](#title) format option.
- Adds support for simple list of global identifiers; see the [global index format](#global-index-format) option.

__Layout improvements__ (As compared to the base [dmd](https://github.com/jsdoc2md/dmd) template):
- Only display summary (first line) of documentation in the index and show full documentation in the linked entry. (This makes thins _a lot_ more compact.)
- Added sorting of the underlying data so everything is displayed in a consistent order.
- Add links to the source code where an identifier is defined.
- Fixes all `<code>` and uses Markdown native backtick instead.
- Uses compact method signatures in any index; much easier to read.
- Render `@throws` on one line if only one `@throws` defined, otherwise generate list.
- Makes the 'Examples' section more compact.
- Only display identifier 'kind' when it's complex; otherwise it's obvious based on the section.

## Extended syntax

### Hide parameters

- A parameter whose description contains the a `@hide` or `@ignore` tag will not be included in documentation.
- This can be useful for parameters which are intended for use by the code/system.
- Consider noting such variables somewhere in the documentation (under a 'Common parameters' section at the start of the API documentation for example).

## Format options

Note, some options can be set via the command line and via `.jsdoc2md.json` while others can only be set via the `.jsdoc2md.json` configuration file (placed in the project root).

### Title

- By default, the generated document will have a title 'API reference'.
- You can override this by setting "title" in the `.jsdoc2md.json` configuration file (cannot be set via command line options).
- Setting the "title" option to literal `false` will suppress the title altogether. This is useful when you have a custom introduction to the API section and you want the API documentation to flow into it. Note that the heading depth is unaffected by this option.

### Heading depth

- The default depth of the title header is '2' (e.g., '##').
- You can change this by setting `heading-depth` in the `.jsdoc2md.json` configuration file or with `--heading-depth` on the CLI.

### Github flavored markdown

- By default, [dmd](https://github.com/jsdoc2md/dmd) generated GitHub flavored markdown.
- If this is a problem, you can set `no-gfm` `true` in the `.jsdoc2md.config.json` or use the `--no-gfm` command line option.

### Global index format

- Controls how the display of the global identifiers index. The default index format is `dl`, which can be pretty bulky.
- This DMD adds support for `list` format. Other options are `dl`, `table`, and `grouped` (not currently supported).
- This option can be set with `global-index-format` in the `.jsdoc2md.json` configuration file or with `--global-index-format` on the CLI.

### Member index format

- Controls how the member identifiers index (of a `@module` or `@namespace` for example) is displayed. Default is `grouped`.
- May be set using `member-index-format` in `.jsdoc2md.config.js` or with `--member-index-format` on the command line. Can be `grouped` or `list`.

### Module index format

- Controls how module identifier indexes are displayed; `dl` by default.
- Can be set with `module-index-format` in the `.jsdoc2md.config.json` file or with the `--module-index-format` option on the command line. Supports `none`, `grouped`, `table`, and `dl`.

### Name format

- By default, identifier names are rendered in plain case. 
- You almost certainly want to override this and set `name-format` in the `.jsdoc2md.config.json` file to `true` or include the `--name-format` option on the CLI. This will cause identifier names to render in monospace. (e.g., `foo`).

### Parameter list format

- Controls how function parameters are displayed; `table` by default.
- Can be set with `param-list-format` in the `.jsdoc2md.config.json` file or with the `--param-list-format` option on the CLI. Support `table` and `list`.

### Private identifiers

- Controls the display of identifiers marked `@private`; by default they are hidden.
- Can be set with `private` in `.jsdoc2md.config.json` (`true` or `false`, the default) or with the `--private` option on the CLI.

## Examples

- [react-window-context](https://github.com/liquid-labs/react-window-context) [API section](https://github.com/liquid-labs/react-window-context#api-reference)
- [regex-repo](https://github.com/liquid-labs/regex-repo) [regex reference](https://github.com/liquid-labs/regex-repo#regex-reference)

## History

<details>
  <summary>We wanted good, compact API documentation and tried a lot of different ways to get there.</summary>

Our main goal was to embed an easy to read, automatically generated API in our `README.md` files.

Our first thought, after some research, was to use [Docusaurus](https://docusaurus.io/), hosted on GitHub. We found [this script](https://gist.github.com/slorber/0bf8c8c8001505f0f99a062ac55bf442) and, even more promising, [this library](https://naver.github.io/jsdoc-to-mdx/docs/setting-up-docusaurus/), which seemed to be exactly what we wanted because Docusaurus supports rendering React components and the script and library promised to generate API documentation as a Docusaurus doc.

Unfortunately, neither worked out. The script has a lot of assumptions and the library just straight up wouldn't work. It loosk like it hasn't been updated since Docusaurus 2.0[^1]. Too bad, it's the right idea.

[^1]:as of 2024-02-09

We instead turned to tackling the goals in two steps. The first step was rendering the jsdocs in markdown and appending those to a simple template.

So, the way jsdocs works is gather's all the doc information into JSON data. The data representing the parsed jsdocs is passed through a templating system to generate the output. We tried many different templates, expecting to find one that worked off the shelf.

However after trying many dmd templates,[^2] we found they were all lacking something we needed (or really wanted). The biggest problem was that none of them handled indexing the methods really well. And we tried all different configurations and setups: using `@module` and making everything a `@memberof` the module, creating a `@namespace`, tricks to create docs by the file (like how Java Docs do it), but nothing came out satisfactorily. The persistent problem was that it was printing the whole description in the index summary, making them difficult to read and entirely redundant.

[^2]: [dmd-clean](https://www.npmjs.com/package/npm-clean), [dmd-bitbucket](https://www.npmjs.com/package/dmd-bitbucket), [npm-clear](https://www.npmjs.com/package/npm-clear), and [@godaddy/dmd](https://www.npmjs.com/package/@godaddy/dmd)

A little less significant, all the existing templates were using the full method signatures in the index summary too. If the other problem hadn't been dispositive, this also made for clunky reading, though we probably would have lived with it if that was the only problem.

In some of them, the intra-page links didn't work, so those were a no-go. And none of them had really good looking output, in our opinion. May mixed in HTML unecessarily.

But one nice thing about jsdoc2md is it's "relatively" easy to customize. You have to wrap your head around their templating system... and frankly the tag documentation is a bit lacking. It's really not clear when you should use `@module`, what's the difference between `@kind` and `@type`, or what a `@namespace` is for, etc.. So it took some experimentation and walking through the template to really understand how things were being used because many details in the output of the existing templates were unexpected in a bad way.

So, anyway, there's a template system called dmd which process [handlebarjs](https://handlebarsjs.com/) and jsdoc2md uses, [dmd](https://github.com/jsdoc2md/dmd) and you can make little template partials to override snippets of their template. So that's what we did, and that's what this library is.

We tried to cleanup a lot of things in template. You can see the full list of modifications in the [`DEV_NOTES.md`](./DEV_NOTES.md). The result is a template that, when used jsdoc2md, creates nice, relatively compact Markdown you can attach right to your `README.md`.

</details>

## Contributing

Plase feel free to submit any [bug reports or feature suggestions](https://github.com/liquid-labs/dmd-readme-api/issues). You're also welcome to submit patches of course. We don't have a full contributors policy yet, but you can post questions on [our discord channel](https://discord.gg/QWAav6fZ5C). It's not monitored 24/7, but you should hear back from us by next business day generally.

## Support and feature requests

The best way to get free support is to [submit a ticket](https://github.com/liquid-labs/dmd-readme-api/issues). You can also become a patron for as little as $1/month and get priority support and request new feature on [all Liquid Labs open source software](https://github.com/liquid-labs). You can get these benefits and [support our work at patreon.com/liquidlabs](https://www.patreon.com/liquidlabs).