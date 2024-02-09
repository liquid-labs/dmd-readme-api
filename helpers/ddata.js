var handlebars = require('handlebars')

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

function sortAll(options) {
  options.data.root.sort((a, b) => {
    const indexAKind = _kinds.findIndex((k) => k.kind === a.kind)
    const indexBKind = _kinds.findIndex((k) => k.kind === b.kind)

    if (indexAKind < indexBKind) { return -1 }
    else if (indexAKind > indexBKind) { return 1 }
    else { return a.name.localeCompare(b.name) }
  })
}

const _kinds = [
  { kind: 'class', title: 'Classes' },
  { kind: 'mixin', title: 'Mixins' },
  { kind: 'member', title: 'Members' },
  { kind: 'namespace', title: 'Namespaces' },
  { kind: 'constant', title: 'Constants' },
  { kind: 'component', title: 'Components' },
  { kind: 'function', title: 'Functions' },
  { kind: 'event', title: 'Events' },
  { kind: 'typedef', title: 'Typedefs' },
  { kind: 'external', title: 'Externals' },
  { kind: 'interface', interface: 'Interfaces' }
]

function kinds() { return _kinds }

exports.getKind = getKind
exports.hasMultipleKinds = hasMultipleKinds
exports.kinds = kinds
exports.kindCount = kindCount
exports.showThis = showThis
exports.sortAll = sortAll