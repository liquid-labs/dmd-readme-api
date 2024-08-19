const cwd = process.cwd()

function extractSourceLink() {
  if (this.meta === undefined) {
    return ''
  }

  const meta = this.meta
  const filename = meta.filename
  const path = meta.path
  const lineno = meta.lineno
  // assumes we've checked out to a folder matching myPackageName
  // TODO: this logic is assuming *nix style path separators
  const relPath = '.' + path.slice(cwd.length)

  return relPath + '/' + filename + '#L' + lineno
}

function extractSummary(description) {
  // No idea why, but the 'm' (multiline match) doesn't seem to be working...
  const match = description.match(/^((?:[^.!?]|\.\.\.|\.[^\s])+[.?!])(?:\s|$)/m)
  return (match && match[1]) || description
}

function and() {
  const testInput = logicHelper(arguments)
  if (testInput === false) { return false }
  // else
  return testInput.reduce((result, input) => {
    if (!result) { return result }
    else { return input }
  }, true)
}

function or() {
  const testInput = logicHelper(arguments)
  if (testInput === false) { return false }
  // else
  return testInput.reduce((result, input) => {
    if (result) { return result }
    else { return input }
  }, false)
}

function intraLink() {
  const source = concat.apply(this, arguments)
  return source
    .replaceAll(/[^a-zA-Z0-9-]/g, '-')
    .replaceAll(/--+/g, '-')
}

function concat() {
  let strings = logicHelper(arguments)
  strings = strings.map((s) => s + '')
  if (strings === false) return ''
  return strings.join('')
}

const knownIndexes = {}

function createIndexLink() {
  const id = intraLink.apply(this, arguments)
  knownIndexes[id] = true
  return `<span id="${id}"></span>`
}

function hasLinkIndex() {
  const id = intraLink.apply(this, arguments)
  return knownIndexes[id]
}

function ifLinkIndex(label) {
  const myArgs = [...arguments]
  const linkIndex = intraLink.apply(this, myArgs.slice(1))
  const hasLinkIndex = knownIndexes[linkIndex]

  if (hasLinkIndex) {
    return `[${label}](#${linkIndex})`
  }
  else {
    return label
  }
}

function makeIndexLinks(options) {
  const { categoryIndex, hasCategoryIndex, kindIndex, hasKindIndex } = _indexLinksHelper.call(this, options)

  let result = ''
  if (hasCategoryIndex === true) {
    result += `[${this.category} index](#${categoryIndex})`
  }
  if (hasKindIndex === true) {
    const hasMultipleKindsInScope =
      Object.keys(options.data.root
        .filter((i) => i.scope === this.scope)
        .reduce((acc, i) => { acc[i.kind] = true; return acc }, {})
      ).length > 1
    const label = this.scope + (hasMultipleKindsInScope ? ' ' + this.kind : '')
    result += hasCategoryIndex === true ? ' | ' : ''
    result += `[${label} index](#${kindIndex})`
  }

  return result
}

function hasIndexLinks(options) {
  if (options.data.root.options['hide-index-links']) {
    return false
  }
  const { hasKindIndex, hasCategoryIndex } = _indexLinksHelper.call(this, options)

  return hasCategoryIndex || hasKindIndex
}

function _indexLinksHelper(options) {
  const kindIndex = intraLink.call(this, this.scope, '-', this.kind, '-index', options)
  const hasKindIndex = knownIndexes[kindIndex]

  let categoryIndex
  let hasCategoryIndex = false
  const hideCategories = options.data.root.options['hide-categories']
  if (hideCategories && this.category !== undefined) {
    categoryIndex = intraLink.call(this, this.scope, '-', this.kind, '-', this.category, '-index', options)
    hasCategoryIndex = knownIndexes[categoryIndex]
  }

  return { kindIndex, hasKindIndex, categoryIndex, hasCategoryIndex }
}

function displayName(name, options) {
  const nameFormat = options.data.root.options['name-format']
  return nameFormat === true ? `\`${name}\`` : name
}

// Helper fenctions
const logicHelper = (argsArray) => {
  // we cut out the last arg because it's the implicit 'options' arg, which isn't really part of the input
  const testInput = [...argsArray].slice(0, -1)
  if (testInput.length === 0) { return false }
  return testInput
}

exports.displayName = displayName
exports.extractSourceLink = extractSourceLink
exports.extractSummary = extractSummary
exports.intraLink = intraLink
exports.ifLinkIndex = ifLinkIndex
exports.makeIndexLinks = makeIndexLinks
exports.hasIndexLinks = hasIndexLinks
exports.concat = concat
exports.createIndexLink = createIndexLink
exports.hasLinkIndex = hasLinkIndex
exports.and = and
exports.or = or
exports.gt = (a, b) => a > b
exports.gte = (a, b) => a >= b
exports.lt = (a, b) => a < b
exports.lte = (a, b) => a <= b
exports.not = (a) => !a
exports.match = (value, regex) => new RegExp(regex).test(value) // TODO: base DMD actually provides 'regex-test'
