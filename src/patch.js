import render from './render'

export default function patch (oldVirtualNode, newVirtualNode, options) {
  const oldNode = oldVirtualNode.domNode
  if (virtualNodesAreEqual(oldVirtualNode, newVirtualNode)) {
    if (newVirtualNode.text) {
      oldNode.nodeValue = newVirtualNode.text
    } else {
      if (typeof newVirtualNode.tag === 'function') {
        newVirtualNode.component = oldVirtualNode.component
        newVirtualNode.component.update(newVirtualNode.props, newVirtualNode.children)
      } else {
        updateChildren(oldNode, oldVirtualNode.children, newVirtualNode.children, options)
        updateProps(oldNode, oldVirtualNode.props, newVirtualNode.props, options && options.refs)
      }
    }
    newVirtualNode.domNode = oldNode
    return oldNode
  } else {
    const parentNode = oldNode.parentNode
    const nextSibling = oldNode.nextSibling
    removeVirtualNode(oldVirtualNode, options && options.refs)
    const newNode = render(newVirtualNode, options)
    if (parentNode) parentNode.insertBefore(newNode, nextSibling)
    newVirtualNode.domNode = newNode
    return newNode
  }
}

function updateProps(domNode, oldProps, newProps, refs) {
  for (const name in oldProps) {
    if (!(newProps && name in newProps)) {
      if (name === 'ref') {
        const oldValue = oldProps[name]
        if (refs && refs[oldValue] === domNode) delete refs[oldValue]
      } else {
        domNode.removeAttribute(name)
      }
    }
  }
  for (let name in newProps) {
    const oldValue = oldProps && oldProps[name]
    const newValue = newProps[name]
    if (newValue !== oldValue) {
      if (name === 'ref') {
        if (refs) {
          if (oldValue && refs[oldValue] === domNode) delete refs[oldValue]
          refs[newValue] = domNode
        }
      } else {
         domNode.setAttribute(name, newValue)
      }
    }
  }
}

function updateChildren (parentElement, oldChildren, newChildren, options) {
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
      patch(oldStartChild, newStartChild, options)
      oldStartChild = oldChildren[++oldStartIndex]
      newStartChild = newChildren[++newStartIndex]
    } else if (virtualNodesAreEqual(oldEndChild, newEndChild)) {
      patch(oldEndChild, newEndChild, options)
      oldEndChild = oldChildren[--oldEndIndex]
      newEndChild = newChildren[--newEndIndex]
    } else if (virtualNodesAreEqual(oldStartChild, newEndChild)) {
      patch(oldStartChild, newEndChild, options)
      parentElement.insertBefore(oldStartChild.domNode, oldEndChild.domNode.nextSibling)
      oldStartChild = oldChildren[++oldStartIndex]
      newEndChild = newChildren[--newEndIndex]
    } else if (virtualNodesAreEqual(oldEndChild, newStartChild)) {
      patch(oldEndChild, newStartChild, options)
      parentElement.insertBefore(oldEndChild.domNode, oldStartChild.domNode);
      oldEndChild = oldChildren[--oldEndIndex]
      newStartChild = newChildren[++newStartIndex]
    } else {
      if (!oldIndicesByKey) oldIndicesByKey = mapOldKeysToIndices(oldChildren, oldStartIndex, oldEndIndex)
      const key = getKey(newStartChild)
      const oldIndex = key ? oldIndicesByKey[key] : null
      if (oldIndex == null) {
        parentElement.insertBefore(render(newStartChild, options), oldStartChild.domNode)
        newStartChild = newChildren[++newStartIndex]
      } else {
        const oldChildToMove = oldChildren[oldIndex]
        patch(oldChildToMove, newStartChild, options)
        oldChildren[oldIndex] = undefined
        parentElement.insertBefore(oldChildToMove.domNode, oldStartChild.domNode)
        newStartChild = newChildren[++newStartIndex]
      }
    }
  }

  if (oldStartIndex > oldEndIndex) {
    const subsequentElement = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].domNode : null
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      parentElement.insertBefore(render(newChildren[i], options), subsequentElement)
    }
  } else if (newStartIndex > newEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const child = oldChildren[i]
      if (child) removeVirtualNode(child, options && options.refs)
    }
  }
}

function removeVirtualNode (virtualNode, refs, removeDOMNode = true) {
  const {domNode, props, children, component} = virtualNode
  if (component) {
    component.destroy()
  } else if (children) {
    for (const child of children) {
      removeVirtualNode(child, refs, false)
    }
  }
  if (refs && props && props.ref && refs[props.ref] === domNode) delete refs[props.ref]
  if (removeDOMNode) domNode.remove()
}

function removeRefs (virtualNode, refs) {
  for (const child of children) {
    removeRefs(child, refs)
  }
}

function virtualNodesAreEqual (oldVirtualNode, newVirtualNode) {
  return (
    getKey(oldVirtualNode) === getKey(newVirtualNode)
      && oldVirtualNode.tag === newVirtualNode.tag
  )
}

function getKey (virtualNode) {
  return virtualNode.props ? virtualNode.props.key : undefined
}

function mapOldKeysToIndices (children, startIndex, endIndex) {
  let oldIndicesByKey = {}
  for (let i = startIndex; i <= endIndex; i++) {
    const key = getKey(children[i])
    if (key) oldIndicesByKey[key] = i
  }
  return oldIndicesByKey;
}
