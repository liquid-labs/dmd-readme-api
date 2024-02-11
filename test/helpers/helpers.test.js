const join = require('node:path').join

const { 
  extractSourceLink,
  extractSummary,
  and,
  or
} = require('../../helpers/helpers')

const myDir = __dirname

const jsdocDataEntry = {
  meta: {
    filename: 'foo.js',
    path: join(myDir),
    lineno: 5
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
    ['I has\nnewline.', 'I has\nnewline.'],
    ['I has\nnewline.', 'I has\nnewline. And another sentence.'],
    ['I have no end', 'I have no end']
  ])('extracts %s from %s', (expected, description) =>
    expect(extractSummary(description)).toBe(expected))
})

describe('and', () => {
  test.each([
    // last input is the implicit 'options' (should be ignored)
    ['false on empty', [{}], false],
    ['true on single true', [true, {}], true],
    ['true on truthy string', ['hi!', {}], true],
    ['false on single false', [false, {}], false],
    ['false on single empty string', ['', {}], false],
    ['true on multiple truthy', [true, 'hi', [], {}], true],
    ['false on second false', [true, false, {}], false],
    ['false on secord empty string', [true, '', {}], false],
    ['false on all false-ish', [false, '', 0, {}], false]
  ])('%s', (description, input, expected) => 
    expect(and(...input)).toBe(expected))
})

describe('or', () => {
  test.each([
    // last input is the implicit 'options' (should be ignored)
    ['false on empty', [{}], false],
    ['true on single true', [true, {}], true],
    ['true on truthy string', ['hi!', {}], true],
    ['false on single false', [false, {}], false],
    ['false on single empty string', ['', {}], false],
    ['true on multiple truthy', [true, 'hi', [], {}], true],
    ['true on second true', [false, true, {}], true],
    ['true on secord truthy string', [false, 'hi', {}], true],
    ['false on all false-ish', [false, '', 0, {}], false]
  ])('%s', (description, input, expected) => 
    expect(or(...input)).toBe(expected))
})