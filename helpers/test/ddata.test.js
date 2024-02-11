const { handledKinds, hasMultipleKinds, sortAll } = require('../ddata.js')

const multiKinds = [
  { kind: 'function', name: 'aFunction' },
  { kind: 'constant', name: 'aTestConstantEntry' },
  { kind: 'constant', name: 'aConstant' }
]

const singleKind = [
  { kind: 'constant', name: 'aTestConstantEntry' },
  { kind: 'constant', name: 'aConstant' }
]

describe('hasMultipleKinds', () => {
  test('recognizes multiple kinds', () => expect(hasMultipleKinds(multiKinds)).toBe(true))

  test('recognizes a single kind', () => expect(hasMultipleKinds(singleKind)).toBe(false))
})