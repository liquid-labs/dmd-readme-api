const cwd = process.cwd()

function extractSourceLink() {
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
  const match = description.match(/([^.!?]+[.?!])(?:.|\n)*/m)
  return (match && match[1]) || description
}

function and() {
  const testInput = logicHelper(arguments)
  if (testInput === false) { return false }
  // else
  return testInput.every(Boolean)
}

function or() {
  const testInput = logicHelper(arguments)
  if (testInput === false) { return false }
  // else
  return testInput.some(Boolean)
}

// Helper fenctions
const logicHelper = (argsArray) => {
  // we cut out the last arg because it's the implicit 'options' arg, which isn't really part of the input
  const testInput = [...argsArray].slice(0, -1)
  if (testInput.length === 0) { return false }
  return testInput
}

exports.extractSourceLink = extractSourceLink
exports.extractSummary = extractSummary
exports.and = and
exports.or = or
