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
  return Array.prototype.every.call(arguments, Boolean);
}

function or() {
  // we cut out the last arg because it's the implicit 'options' arg, which isn't really part of the input
  return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
}

exports.extractSourceLink = extractSourceLink
exports.extractSummary = extractSummary
exports.and = and
exports.or = or