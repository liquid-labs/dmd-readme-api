# dmd-readme-api

A [jsdoc2md](https://github.com/jsdoc2md/jsdoc-to-markdown) template plugin generating elegant, compact one-page APIs in markdown, suitable for embedding in a `README.md`.

- [Installation](#installation)
- [Usage](#usage)
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
    --plugin dmd-readme-api
```

<details>
  <summary>You can leave off the `--plugin` if it's specified in the `jsdoc.config.json` file. Expand this section for furthe details.</summary>

- The `--global-index-format list` bit is important, it's what the template was designed to use and we don't fully support the 'table', 'grouped', or 'dl' formats yet. You're free to try them, but results are not guaranteed.
- You don't need to specify the plugin on both the CLI and in the config file (see below).
- You do need the `--files 'path/to/src/**'` bit, even though you also (and really must) specify the 'source' in the config file as well. jsdoc2md and jsdoc don't seem to be fully integrated at this point.
- Same with `--name-format`. It's part of the style and is recommended, but can only be set on the command line at this time.

</details>

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
        "cleverLinks": true,
        "monospaceLinks": true
    }
}
```

<details>
  <summary>The above examples should get you started and my "just work" in many cases. Expand this section for additional details..</summary>

- The 'template' settings aren't really effective yet, but we'll implement them in the template soon if there's a demand. (I belivee it may take a chance to jsdoc2md, but need to look into it more.) Also, again, you don't need to specify the plugin in both places.
- You probably don't need to worry about the 'sourceType' or tags' sections. You can almost always leave them as is.
- Refer [jsdoc2markdown](https://github.com/jsdoc2md/jsdoc-to-markdown) for details on the `jsdoc.config.json` file. It's basically where you configure where to read the files and, optionally, register the plugin.

</details>

## Examples

- [react-window-context](https://github.com/liquid-labs/react-window-context) [API section](https://github.com/liquid-labs/react-window-context#api-reference)

## History

<details>
  <summary>We wanted good API documentation and a live demo and tried a lot of different ways to get there.</summary>

We wanted to accomplish two main goals:

1) Embed an API in our `README.md` and update it automatically.
2) Provide a live demo.

Our first thought, after some research, was to use [Docusaurus](https://docusaurus.io/), hosted on GitHub. We found [this script](https://gist.github.com/slorber/0bf8c8c8001505f0f99a062ac55bf442) and, even more promising, [this library](https://naver.github.io/jsdoc-to-mdx/docs/setting-up-docusaurus/), which seemed to be exactly what we wanted because Docusaurus supports rendering React components and the script and library promised to generate API documentation as a Docusaurus doc.

Unfortunately, neither worked out. The script has a lot of assumptions and the library just straight up wouldn't work. It loosk like it hasn't been updated since Docusaurus 2.0[^1]. Too bad, it's the right idea.

[^1]:as of 2024-02-09

We instead turned to tackling the goals in two steps. The first step was rendering the jsdocs in markdown and appending those to a simple template. We'l then use [CodePen](https://codepen.io) or something to host a live demo.

So, the way jsdocs works is gather's all the doc information into JSON data. The data representing the parsed jsdocs is passed through a templating system to generate the output. We tried many different templates, expecting to find one that worked off the shelf.

However after trying many dmd templates,[^2] we found they were all lacking something we needed (or really wanted). The biggest problem was that none of them handled indexing the methods really well. And we tried all different configurations and setups: using `@module` and making everything a `@memberof` the module, creating a `@namespace`, tricks to create docs by the file (like how Java Docs do it), but nothing came out satisfactorily. The persistent problem was that it was printing the whole description in the index summary, making them difficult to read and entirely redundant.

[^2]: [dmd-clean](https://www.npmjs.com/package/npm-clean), [dmd-bitbucket](https://www.npmjs.com/package/dmd-bitbucket), [npm-clear](https://www.npmjs.com/package/npm-clear), and [@godaddy/dmd](https://www.npmjs.com/package/@godaddy/dmd)

A little less significant, all the existing templates were using the full method signatures in the index summary too. If the other problem hadn't been dispositive, this also made for clunky reading, though we probably would have lived with it if that was the only problem.

In some of them, the intra-page links didn't work, so those were a no-go. And none of them had really good looking output, in our opinion. May mixed in HTML unecessarily.

But one nice thing about jsdoc2md is it's "relatively" easy to customize. You have to wrap your head around their templating system... and frankly the tag documentation is a bit lacking. It's really not clear when you should use `@module`, what's the difference between `@kind` and `@type`, or what a `@namespace` is for, etc.. So it took some experimentation and walking through the template to really understand how things were being used because many details in the output of the existing templates were unexpected in a bad way.

So, anyway, there's a template system called dmd which process [handlebarjs](https://handlebarsjs.com/) and jsdoc2md uses, [dmd](https://github.com/jsdoc2md/dmd) and you can make little template partials to override snippets of their template. So that's what we did, and that's what this library is.

We tried to cleanup a lot of things in template. You can see the full list of modifications in the [`DEV_NOTES.md`](./DEV_NOTES.md). In summmary, though, we believe our template:

- Removes unecessary verbosity.
- Increases the generated API document's clarity and readability.
- Generates consistent, proper markdown.

The result is a templaet that, when used jsdoc2md, creates nice, relatively compact Markdown you can attach right ot your `README.md`.

</details>

## Contributing

Plase feel free to submit any [bug reports or feature suggestions](https://github.com/liquid-labs/dmd-readme-api/issues). You're also welcome to submit patches of course. We don't have a full contributors policy yet, but you can post questions on [our discord channel](https://discord.gg/QWAav6fZ5C). It's not monitored 24/7, but you should hear back from us by next business day generally.

## Support and feature requests

The best way to get free support is to [submit a ticket](https://github.com/liquid-labs/dmd-readme-api/issues). You can also become a patron for as little as $1/month and get priority support and request new feature on [all Liquid Labs open source software](https://github.com/liquid-labs). You can get these benefits and [support our work at patreon.com/liquidlabs](https://www.patreon.com/liquidlabs).