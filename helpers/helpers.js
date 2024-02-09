function extractSummary(description) {
  // No idea why, but the 'm' (multiline match) doesn't seem to be working...
  return description.match(/([^.]+\.)(?:.|\n)*/m)[1] || description
}

function and() {
  return Array.prototype.every.call(arguments, Boolean);
}

function or() {
  return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
}

exports.extractSummary = extractSummary
exports.and = and
exports.or = or