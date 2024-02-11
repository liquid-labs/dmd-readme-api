const join = require('node:path').join

const { 
  extractSourceLink,
  extractSummary,
  and,
  or
} = require('../helpers')

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
    expect(result).toBe('./helpers/test/foo.js#L5')
  })
})

describe('extractSummary', () => {
  test.each([
    ['Hi!', 'Hi!'],
    ['Hi!', 'Hi! Another sentence.'],
    ['Wierd?', 'Wierd? But whatever.'],
    ['I has\nnewline.', 'I has\nnewline.'],
    ['I has\nnewline.', 'I has\nnewline. And another sentence.']
  ])('extracts %s from %s', (expected, description) =>
    expect(extractSummary(description)).toBe(expected))
})