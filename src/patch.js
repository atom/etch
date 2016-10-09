import render from './render'
import virtualNodesByElement from './virtual-nodes-by-element'

export default function patch (element, newVirtualNode) {
  const oldVirtualNode = virtualNodesByElement.get(element)
  if (!oldVirtualNode) throw new Error('No virtual node found for element. You can currently only patch elements produced via the render or patch functions.')
  patchVirtualNode(oldVirtualNode, newVirtualNode)
}

function patchVirtualNode (oldVirtualNode, newVirtualNode) {
  const element = oldVirtualNode.element
  patchAttributes(element, oldVirtualNode.props, newVirtualNode.props)
  patchChildren(element, oldVirtualNode.children, newVirtualNode.children)
  newVirtualNode.element = element
}

function patchAttributes(element, oldProps, newProps) {
  for (let prop in oldProps) {
    if (!(prop in newProps)) element.removeAttribute(prop)
  }
  for (let prop in newProps) {
    const newValue = newProps[prop]
    if (newValue !== oldProps[prop]) element.setAttribute(prop, newValue)
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
    } else if (keysEqual(oldStartChild, newStartChild)) {
      patchVirtualNode(oldStartChild, newStartChild)
      oldStartChild = oldChildren[++oldStartIndex]
      newStartChild = newChildren[++newStartIndex]
    } else if (keysEqual(oldEndChild, newEndChild)) {
      patchVirtualNode(oldEndChild, newEndChild)
      oldEndChild = oldChildren[--oldEndIndex]
      newEndChild = newChildren[--newEndIndex]
    } else if (keysEqual(oldStartChild, newEndChild)) {
      patchVirtualNode(oldStartChild, newEndChild)
      parentElement.insertBefore(oldStartChild.element, oldEndChild.element.nextSibling)
      oldStartChild = oldChildren[++oldStartIndex]
      newEndChild = newChildren[--newEndIndex]
    } else if (keysEqual(oldEndChild, newStartChild)) {
      patchVirtualNode(oldEndChild, newStartChild)
      parentElement.insertBefore(oldEndChild.element, oldStartChild.element);
      oldEndChild = oldChildren[--oldEndIndex]
      newStartChild = newChildren[++newStartIndex]
    } else {
      if (!oldIndicesByKey) oldIndicesByKey = mapOldKeysToIndices(oldChildren, oldStartIndex, oldEndIndex)
      const oldIndex = oldIndicesByKey[newStartChild.key]
      if (oldIndex == null) {
        parentElement.insertBefore(render(newStartChild), oldStartChild.element)
        newStartChild = newChildren[++newStartIndex]
      } else {
        const oldChildToMove = oldChildren[oldIndex]
        patchVirtualNode(oldChildToMove, newStartChild)
        oldChildren[oldIndex] = undefined
        parentElement.insertBefore(oldChildToMove.element, oldStartChild.element)
        newStartChild = newChildren[++newStartIndex]
      }
    }
  }

  if (oldStartIndex > oldEndIndex) {
    const subsequentElement = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].element : null
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      parentElement.insertBefore(render(newChildren[i]), subsequentElement)
    }
  } else if (newStartIndex > newEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      oldChildren[i].element.remove()
    }
  }
}

function keysEqual (oldVirtualNode, newVirtualNode) {
  return (
    oldVirtualNode.props
      && newVirtualNode.props
      && oldVirtualNode.props.key === newVirtualNode.props.key
  )
}

function mapOldKeysToIndices (children, startIndex, endIndex) {
  let oldIndicesByKey = {}
  for (let i = startIndex; i <= endIndex; i++) {
    const key = children[i].key
    if (key) oldIndicesByKey[key] = i
  }
  return oldIndicesByKey;
}
