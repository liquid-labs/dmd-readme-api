const resolve = require('node:path').resolve

const dmd = require('dmd')

const pluginPath = resolve(__dirname, '..', '..')

describe('template', () => {
  describe('single valid input', () => {
    const singleData = [
      {
        id: 'someclass',
        longname: 'someclass',
        name: 'someclass',
        kind: 'class',
        description: 'is a class',
        scope: 'global',
        meta: {
          filename: 'foo.js',
          path: process.cwd() + '/test/helpers/partial',
          lineno: 8
        }
      }
    ]

    const output = dmd(singleData, { plugin: pluginPath, noCache: true, 'global-index-format': 'list' })

    test('produces no index', () => expect(output).not.toMatch(/Classes/m))

    test('documents the class', () => expect(output).toMatch(/is a class/m))
  })

  describe('multiple inputs of the same kind', () => {
    const multiDataSameKind = [
      {
        id: 'someclass',
        longname: 'someclass',
        name: 'someclass',
        kind: 'class',
        description: 'is a class',
        scope: 'global',
        meta: {
          filename: 'foo.js',
          path: process.cwd() + '/test/helpers/partial',
          lineno: 8
        }
      },
      {
        id: 'anotherclass',
        longname: 'anotherclass',
        name: 'anotherclass',
        kind: 'class',
        description: 'another class',
        scope: 'global',
        meta: {
          filename: 'foo.js',
          path: process.cwd() + '/test/helpers/partial',
          lineno: 20
        }
      },
    ]

    const output = dmd(multiDataSameKind, { plugin: pluginPath, noCache: true, 'global-index-format': 'list' })

    test('produces index listing single kind', () => expect(output).toMatch(/^Classes:/m))

    test('documents the classes', () => {
      expect(output).toMatch(/is a class/m)
      expect(output).toMatch(/another class/m)
    })
  })

  describe('multiple inputs of different types', () => {
    const multiDataDifferentKind = [
      {
        id: 'someclass',
        longname: 'someclass',
        name: 'someclass',
        kind: 'class',
        description: 'is a class',
        scope: 'global',
        meta: {
          filename: 'foo.js',
          path: process.cwd() + '/test/helpers/partial',
          lineno: 8
        }
      },
      {
        id: 'aFunction',
        longname: 'aFunction',
        name: 'aFunction',
        kind: 'function',
        description: 'a function',
        scope: 'global',
        meta: {
          filename: 'foo.js',
          path: process.cwd() + '/test/helpers/partial',
          lineno: 20
        }
      },
    ]

    const output = dmd(multiDataDifferentKind, { plugin: pluginPath, noCache: true, 'global-index-format': 'list' })

    test('produces a global index with multiple top-level kinds', () => {
      expect(output).toMatch(/^- Classes:/m)
      expect(output).toMatch(/^- Functions:/m)
    })

    test('documents the class', () => expect(output).toMatch(/is a class/m))

    test('documents the function', () => expect(output).toMatch(/a function/m))
  })
})