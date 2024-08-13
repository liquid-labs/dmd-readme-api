/* global describe expect test */
const { handledKinds, hasMultipleKinds, sortAll } = require('../../helpers/ddata')

const multiKinds = [
  { kind : 'function', name : 'aFunction' },
  { kind : 'constant', name : 'aTestConstantEntry' },
  { kind : 'constant', name : 'aConstant' }
]

const singleKind = [
  { kind : 'constant', name : 'aTestConstantEntry' },
  { kind : 'constant', name : 'aConstant' }
]

const inOrderKinds = [
  { kind : 'constant', name : 'aConstant' },
  { kind : 'constant', name : 'aTestConstantEntry' },
  { kind : 'function', name : 'aFunction' }
]

describe('handledKinds', () => {
  test('returns an array of strings', () => {
    const result = handledKinds()
    expect(Array.isArray(result)).toBe(true)
    expect(result.some(({ kind, title }) =>
      typeof kind !== 'string') && typeof title !== 'string').toBe(false)
  })
})

describe('hasMultipleKinds', () => {
  test('recognizes multiple kinds', () => expect(hasMultipleKinds(multiKinds)).toBe(true))

  test('recognizes a single kind', () => expect(hasMultipleKinds(singleKind)).toBe(false))
})

describe('sortAll', () => {
  const sortFields = ['scope', 'category']

  test('sorts set with single kind', () => {
    const data =
      structuredClone({ data : { root : singleKind } })
    sortAll(sortFields, data)
    const sortedSet = data.data.root
    expect(sortedSet).toHaveLength(2)
    expect(sortedSet[0].name).toBe('aConstant')
  })

  test('sorts set with multiple kinds', () => {
    const data = structuredClone({ data : { root : multiKinds } })
    sortAll(sortFields, data)
    const sortedSet = data.data.root
    expect(sortedSet).toHaveLength(3)
    expect(sortedSet[0].name).toBe('aConstant')
    expect(sortedSet[2].name).toBe('aFunction')
  })

  test('no change when set in order', () => {
    const data = structuredClone({ data : { root : inOrderKinds } })
    sortAll(sortFields, data)
    const sortedSet = data.data.root
    expect(sortedSet).toEqual(inOrderKinds)
  })
})
