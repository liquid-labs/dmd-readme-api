/* global describe expect test */
const resolve = require('node:path').resolve

const dmd = require('dmd')

const pluginPath = resolve(__dirname, '..', '..')

describe('template', () => {
  describe('single valid input', () => {
    const singleData = [
      {
        id          : 'someclass',
        longname    : 'someclass',
        name        : 'someclass',
        kind        : 'class',
        description : 'is a class',
        scope       : 'global',
        meta        : {
          filename : 'foo.js',
          path     : process.cwd() + '/test/helpers/partial',
          lineno   : 8
        }
      }
    ]

    const output = dmd(singleData, { plugin : pluginPath, noCache : true, 'global-index-format' : 'list' })

    test('produces no index', () => expect(output).not.toMatch(/Classes/m))

    test('documents the class', () => expect(output).toMatch(/is a class/m))
  })

  describe('multiple inputs of the same kind', () => {
    const multiDataSameKind = [
      {
        id          : 'someclass',
        longname    : 'someclass',
        name        : 'someclass',
        kind        : 'class',
        description : 'is a class',
        scope       : 'global',
        meta        : {
          filename : 'foo.js',
          path     : process.cwd() + '/test/helpers/partial',
          lineno   : 8
        }
      },
      {
        id          : 'anotherclass',
        longname    : 'anotherclass',
        name        : 'anotherclass',
        kind        : 'class',
        description : 'another class',
        scope       : 'global',
        meta        : {
          filename : 'foo.js',
          path     : process.cwd() + '/test/helpers/partial',
          lineno   : 20
        }
      }
    ]

    const output = dmd(multiDataSameKind, { plugin : pluginPath, noCache : true, 'global-index-format' : 'list' })

    test('produces index listing single kind', () => expect(output).toMatch(/^Classes:/m))

    test('documents the classes', () => {
      expect(output).toMatch(/is a class/m)
      expect(output).toMatch(/another class/m)
    })
  })

  describe('multiple inputs of different types', () => {
    const multiDataDifferentKind = [
      {
        id          : 'someclass',
        longname    : 'someclass',
        name        : 'someclass',
        kind        : 'class',
        description : 'is a class',
        scope       : 'global',
        meta        : {
          filename : 'foo.js',
          path     : process.cwd() + '/test/helpers/partial',
          lineno   : 8
        }
      },
      {
        id          : 'aFunction',
        longname    : 'aFunction',
        name        : 'aFunction',
        kind        : 'function',
        description : 'a function',
        scope       : 'global',
        meta        : {
          filename : 'foo.js',
          path     : process.cwd() + '/test/helpers/partial',
          lineno   : 20
        }
      }
    ]

    const output = dmd(multiDataDifferentKind, { plugin : pluginPath, noCache : true, 'global-index-format' : 'list' })

    test('produces a global index with multiple top-level kinds', () => {
      expect(output).toMatch(/^- Classes:/m)
      expect(output).toMatch(/^- Functions:/m)
    })

    test('documents the class', () => expect(output).toMatch(/is a class/m))

    test('documents the function', () => expect(output).toMatch(/a function/m))
  })
})

describe('realistic class documentation', () => {
  const data = [
  {
    "id": "InvalidArgumentError()",
    "longname": "InvalidArgumentError",
    "name": "InvalidArgumentError",
    "kind": "constructor",
    "description": "The `InvalidArgumentError` constructor.",
    "memberof": "InvalidArgumentError",
    "params": [
      {
        "type": {
          "names": [
            "string",
            "InvalidArgumentOptions",
            "undefined"
          ]
        },
        "description": "The package name, a \n  [`InvalidArgumentOptions`](#InvalidArgumentOptions) object, or undefined (which will omit the package name from \n  the message unless specified in a final options argument).",
        "name": "packageNameOrOptions"
      },
      {
        "type": {
          "names": [
            "InvalidArgumentOptions",
            "undefined"
          ]
        },
        "description": "The final options `Object`, if any, which is passed to the `Error` \n  super-constructor and whose values can override the positional arguments.",
        "name": "options"
      }
    ],
    "order": 2
  },
    {
    "id": "InvalidArgumentError",
    "longname": "InvalidArgumentError",
    "name": "InvalidArgumentError",
    "kind": "class",
    "scope": "global",
    "description": "A class!",
    "meta": {
      "lineno": 52,
      "filename": "zoa6cwksxi6tdg5yl4xuw.js",
      "path": "/var/folders/b_/cqvmw4wd3p97n3h4qh85kb1c0000gp/T"
    },
    "order": 1
  },
  {
    "id": "InvalidArgumentOptions",
    "longname": "InvalidArgumentOptions",
    "name": "InvalidArgumentOptions",
    "kind": "typedef",
    "scope": "global",
    "description": "The arguments option for `InvalidArgumentError`. These options are also passed to the `Error` constructor, which may \nrecognize additional options.",
    "properties": [
      {
        "type": {
          "names": [
            "string"
          ]
        },
        "description": "The name of the function to use in any generated message.",
        "name": "functionName"
      }
    ],
    "meta": {
      "lineno": 6,
      "filename": "zoa6cwksxi6tdg5yl4xuw.js",
      "path": "/var/folders/b_/cqvmw4wd3p97n3h4qh85kb1c0000gp/T"
    },
    "order": 0
  }]

  const output = dmd(data, { plugin : pluginPath, noCache : true, 'global-index-format' : 'list' })
  console.log(output)

  test('links parameters to defined type', () => expect(output).toMatch(/\\\| \[`InvalidArgumentOptions`\]\(#InvalidArgumentOptions\) \\\|/m))
})
