module.exports = function updateRef (domNode, oldRefName, newRefName, refs) {
  if (newRefName !== oldRefName) {
    if (typeof oldRefName === 'function') oldRefName(null)
    else if (oldRefName && refs[oldRefName] === domNode) delete refs[oldRefName]
    if (typeof newRefName === 'function') newRefName(domNode)
    else if (newRefName) refs[newRefName] = domNode
  }
}
