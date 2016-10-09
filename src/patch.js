import render from './render'

export default function patch (oldVirtualNode, newVirtualNode) {
  const oldElement = oldVirtualNode.domNode
  if (virtualNodesAreEqual(oldVirtualNode, newVirtualNode)) {
    if (newVirtualNode.text) {
      oldElement.nodeValue = newVirtualNode.text
    } else {
      patchChildren(oldElement, oldVirtualNode.children, newVirtualNode.children)
      patchAttributes(oldElement, oldVirtualNode.props, newVirtualNode.props)
    }
    newVirtualNode.domNode = oldElement
    return oldElement
  } else {
    const parentNode = oldElement.parentNode
    const nextSibling = oldElement.nextSibling
    removeVirtualNode(oldVirtualNode)
    const newElement = render(newVirtualNode)
    if (parentNode) parentNode.insertBefore(newElement, nextSibling)
    newVirtualNode.domNode = newElement
    return newElement
  }
}

function patchAttributes(domNode, oldProps, newProps) {
  for (let prop in oldProps) {
    if (!(prop in newProps)) domNode.removeAttribute(prop)
  }
  for (let prop in newProps) {
    const newValue = newProps[prop]
    if (newValue !== oldProps[prop]) domNode.setAttribute(prop, newValue)
  }
}

function patchChildren (parentElement, oldChildren, newChildren) {
  let oldStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let oldStartChild = oldChildren[0]
  let oldEndChild = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newEndIndex = newChildren.length - 1
  let newStartChild = newChildren[0]
  let newEndChild = newChildren[newEndIndex]

  let oldIndicesByKey

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartChild) {
      oldStartChild = oldChildren[++oldStartIndex]
    } else if (!oldEndChild) {
      oldEndChild = oldChildren[--oldEndIndex]
    } else if (virtualNodesAreEqual(oldStartChild, newStartChild)) {
      patch(oldStartChild, newStartChild)
      oldStartChild = oldChildren[++oldStartIndex]
      newStartChild = newChildren[++newStartIndex]
    } else if (virtualNodesAreEqual(oldEndChild, newEndChild)) {
      patch(oldEndChild, newEndChild)
      oldEndChild = oldChildren[--oldEndIndex]
      newEndChild = newChildren[--newEndIndex]
    } else if (virtualNodesAreEqual(oldStartChild, newEndChild)) {
      patch(oldStartChild, newEndChild)
      parentElement.insertBefore(oldStartChild.domNode, oldEndChild.domNode.nextSibling)
      oldStartChild = oldChildren[++oldStartIndex]
      newEndChild = newChildren[--newEndIndex]
    } else if (virtualNodesAreEqual(oldEndChild, newStartChild)) {
      patch(oldEndChild, newStartChild)
      parentElement.insertBefore(oldEndChild.domNode, oldStartChild.domNode);
      oldEndChild = oldChildren[--oldEndIndex]
      newStartChild = newChildren[++newStartIndex]
    } else {
      if (!oldIndicesByKey) oldIndicesByKey = mapOldKeysToIndices(oldChildren, oldStartIndex, oldEndIndex)
      const key = getKey(newStartChild)
      const oldIndex = key ? oldIndicesByKey[key] : null
      if (oldIndex == null) {
        parentElement.insertBefore(render(newStartChild), oldStartChild.domNode)
        newStartChild = newChildren[++newStartIndex]
      } else {
        const oldChildToMove = oldChildren[oldIndex]
        patch(oldChildToMove, newStartChild)
        oldChildren[oldIndex] = undefined
        parentElement.insertBefore(oldChildToMove.domNode, oldStartChild.domNode)
        newStartChild = newChildren[++newStartIndex]
      }
    }
  }

  if (oldStartIndex > oldEndIndex) {
    const subsequentElement = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].domNode : null
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      parentElement.insertBefore(render(newChildren[i]), subsequentElement)
    }
  } else if (newStartIndex > newEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const child = oldChildren[i]
      if (child) removeVirtualNode(child)
    }
  }
}

function removeVirtualNode (virtualNode) {
  if (virtualNode.component) virtualNode.component.destroy()
  virtualNode.domNode.remove()
}

function virtualNodesAreEqual (oldVirtualNode, newVirtualNode) {
  return (
    getKey(oldVirtualNode) === getKey(newVirtualNode)
      && oldVirtualNode.tag === newVirtualNode.tag
  )
}

function getKey (virtualNode) {
  return virtualNode.props ? virtualNode.props.key : null
}

function mapOldKeysToIndices (children, startIndex, endIndex) {
  let oldIndicesByKey = {}
  for (let i = startIndex; i <= endIndex; i++) {
    const key = getKey(children[i])
    if (key) oldIndicesByKey[key] = i
  }
  return oldIndicesByKey;
}
