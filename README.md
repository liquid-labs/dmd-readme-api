# dmd-readme-api

A [jsdoc2md](https://github.com/jsdoc2md/jsdoc-to-markdown) dmd template plugin suitable for generating elegant, compact one-page APIs in markdown, suitable for embedding in a `README.md`.

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
  <summary>You can leave off the `--plugin` if it's specified in the `jsdoc.config.json` file. Further details can be found here.</summary>

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
  <summary>The above examples should get started and are hopefully sufficient in many cases. Details on configuration can be found here.</summary>

- The 'template' settings aren't really effective yet, but we'll implement them in the template soon if there's a demand. (I belivee it may take a chance to jsdoc2md, but need to look into it more.) Also, again, you don't need to specify the plugin in both places.
- You probably don't need to worry about the 'sourceType' or tags' sections. You can almost always leave them as is.
- Refer [jsdoc2markdown](https://github.com/jsdoc2md/jsdoc-to-markdown) for details on the `jsdoc.config.json` file. It's basically where you configure where to read the files and, optionally, register the plugin.

</details>

## Examples

- [react-window-context](https://github.com/liquid-labs/react-window-context) [API section](https://github.com/liquid-labs/react-window-context#apai-reference)

## History

<details>
  <summary>We wanted good API documentation and a live demo and tried a lot of different ways to get there.</summary>

We wanted to accomplish two main goals:

1) Embed an API in our `README.md` and update it automatically.
2) Provide a live demo.

Our first thought, after some research, was to use [Docusaurus](https://docusaurus.io/), hosted on GitHub. We found [this script](https://gist.github.com/slorber/0bf8c8c8001505f0f99a062ac55bf442) and, even more promising, [this library](https://naver.github.io/jsdoc-to-mdx/docs/setting-up-docusaurus/), which seemed to be exactly what we wanted.

Unfortunately, neither worked out. The script has a lot of assumptions and the library just straight up wouldn't work. It loosk like it hasn't been updated since Docusaurus 2.0[^1]. Too bad, it's the right idea.

[^1:as of 2024-02-09]

We instead turned to generating rendering the jsdocs in markdown and appending those to a simple template. And then using [CodePen](https://codepen.io) to host the live demo.

However after trying many DMD templates,[^2] we found they were all lacking something we needed (or really wanted). The biggest problem was that none of them handled indexing the methods really well. And we tried all different with: using `@module` and making everything a `@memberof` the module, creating a `@namespace`, tricks to create docs by the file (like how Java Docs do it), and nothing really came out satisfactorily. The persistent problem was that it was printing the whole description in the index summary, making them practically unwieldly.

[^2: [dmd-clean](https://www.npmjs.com/package/npm-clean), [dmd-bitbucket](https://www.npmjs.com/package/dmd-bitbucket), [npm-clear](https://www.npmjs.com/package/npm-clear), and [@godaddy/dmd](https://www.npmjs.com/package/@godaddy/dmd)]

A little less significant, they were using the full method signatures in the index summary too. If the other problem hadn't been dispositive, this also made for clunky reading, though we probably would have lived with it if that was the only problem.

In some of them, the intra-page links didn't work, so those were a no-go. And none of them had reallygood looking output, in our opinion.

One nice thing about jsdoc2md and jsdoc is there "relatively" easy to customize. You have to wrap your head around their templating system... and frankly the tag documentation is a bit lacking. It's really not clear when you should use `@module`, what's the difference between `@kind` and `@type`, what is a `@namespace` for. (TODO: Submit some documentaiton updates.)

So, anyway, there's a system called dmd which process [handlebarjs](https://handlebarsjs.com/), and jsdoc2md has their own dmd template, [@jsdoc2md/dmd](https://github.com/jsdoc2md/dmd) and you can make little plugins to override their stuff. So that's what we did, and that's what this library is.

We tried to cleanup a lot of things in template. You can see the full list of modifications in the [`DEV_NOTES.md`](./DEV_NOTES.md). Some of the highlights include:

</details>