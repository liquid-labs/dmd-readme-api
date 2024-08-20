/* global describe expect test */
const join = require('node:path').join

const {
  extractSourceLink,
  extractSummary,
  and,
  or
} = require('../../helpers/helpers')

const myDir = __dirname

const jsdocDataEntry = {
  meta : {
    filename : 'foo.js',
    path     : join(myDir),
    lineno   : 5
  }
}

describe('extractSourceLink', () => {
  test('extracts relative source from absolute meta source', () => {
    const result = extractSourceLink.call(jsdocDataEntry)
    expect(result).toBe('./test/helpers/foo.js#L5')
  })
})

describe('extractSummary', () => {
  test.each([
    ['Hi!', 'Hi!'],
    ['Hi!', 'Hi! Another sentence.'],
    ['Wierd?', 'Wierd? But whatever.'],
    ['I has newline.', 'I has\nnewline.'],
    ['I has newline.', 'I has\nnewline. And another sentence.'],
    ['I have no end', 'I have no end'],
    ['I has... ellipses.', 'I has... ellipses.'],
    ['I has... ellipses.', 'I has... ellipses. And more!'],
    ['Func(...) is fine.', 'Func(...) is fine. Right?'],
    ['__I__ *has* [<bold>formatting</bold>](#foo)!', '__I__ *has* [<bold>formatting</bold>](#foo)! Yay!'],
    ['Func(..) is fine.', 'Func(..) is fine. Right?'],
    ['127.2.2.1 is an IP address.', '127.2.2.1 is an IP address.'],
    ['127.2.2.1 is an IP address.', '127.2.2.1 is an IP address. Or is it?'],
    ['What.is.this?', 'What.is.this? A string sentence!']
  ])('extracts %s from %s', (expected, description) =>
    expect(extractSummary(description)).toBe(expected))
})

describe('and', () => {
  test.each([
    // last input is the implicit 'options' (should be ignored)
    ['false on empty', [{}], false],
    ['true on single true', [true, {}], true],
    ['true on truthy string', ['hi!', {}], 'hi!'],
    ['false on single false', [false, {}], false],
    ['false on single empty string', ['', {}], ''],
    ['true on multiple truthy', [true, 'hi', [], {}], []],
    ['false on second false', [true, false, {}], false],
    ['false on secord empty string', [true, '', {}], ''],
    ['false on all false-ish', [false, '', 0, {}], false]
  ])('%s', (description, input, expected) =>
    expect(and(...input)).toEqual(expected))
})

describe('or', () => {
  test.each([
    // last input is the implicit 'options' (should be ignored)
    ['false on empty', [{}], false],
    ['true on single true', [true, {}], true],
    ['true on truthy string', ['hi!', {}], 'hi!'],
    ['false on single false', [false, {}], false],
    ['false on single empty string', ['', {}], ''],
    ['true on multiple truthy', [true, 'hi', [], {}], true],
    ['true on second true', [false, true, {}], true],
    ['true on secord truthy string', [false, 'hi', {}], 'hi'],
    ['false on all false-ish', [false, '', 0, {}], 0]
  ])('%s', (description, input, expected) =>
    expect(or(...input)).toEqual(expected))
})
