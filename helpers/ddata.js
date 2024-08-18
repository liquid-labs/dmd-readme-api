const _handledKinds = [
  { kind : 'class', title : 'Classes' },
  { kind : 'mixin', title : 'Mixins' },
  { kind : 'member', title : 'Members' },
  { kind : 'namespace', title : 'Namespaces' },
  { kind : 'constant', title : 'Constants' },
  { kind : 'component', title : 'Components' },
  { kind : 'function', title : 'Functions' },
  { kind : 'event', title : 'Events' },
  { kind : 'typedef', title : 'Typedefs' },
  { kind : 'external', title : 'Externals' },
  { kind : 'interface', interface : 'Interfaces' }
]

function handledKinds() { return _handledKinds }

function hasMultipleKinds(globals) {
  return Object.keys(globals.reduce((acc, g) => { acc[g.kind] = true; return acc }, {})).length > 1
}

function sortAll(sortFields, options) {
  options.data.root.sort((a, b) => {
    sortFields = [...sortFields, 'kind']
    const indexAKind = _handledKinds.findIndex((k) => k.kind === a.kind)
    const indexBKind = _handledKinds.findIndex((k) => k.kind === b.kind)

    const aSortFields = sortFields.map(function(sortField) {
      return a[sortField]
    })
    const bSortFields = sortFields.map(function(sortField) {
      return b[sortField]
    })
    for (let i = 0; i < sortFields.length; i += 1) {
      const fieldA = aSortFields[i]
      const fieldB = bSortFields[i]
      if (fieldA !== fieldB) {
        return fieldA.localeCompare(fieldB)
      }
    }

    if (indexAKind < indexBKind) { return -1 }
    else if (indexAKind > indexBKind) { return 1 }

    return a.name.localeCompare(b.name)
  })
}

exports.handledKinds = handledKinds
exports.hasMultipleKinds = hasMultipleKinds
exports.sortAll = sortAll
