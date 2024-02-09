function getKind(globals, index) {
  return globals[index].kind
}

function hasMultipleKinds(globals) {
  return Object.keys(globals.reduce((acc, g) => { acc[g.kind] = true; return acc }, {})).length > 1
}

function kindCount(globals, kind) {
  return globals.filter((g) => g.kind === kind).length
}

function showThis() {
  return JSON.stringify(this, null, '  ')
}

exports.getKind = getKind
exports.hasMultipleKinds = hasMultipleKinds
exports.kindCount = kindCount
exports.showThis = showThis