const RESERVED_PROPS = new Set(['on', 'ref'])

export default function updateProps(domNode, oldProps, newProps, options) {
  const refs = options && options.refs
  updateAttributes(domNode, oldProps, newProps)
  if (refs) updateRef(domNode, oldProps && oldProps.ref, newProps && newProps.ref, refs)
  updateEventListeners(domNode, oldProps && oldProps.on, newProps && newProps.on)
}

function updateAttributes (domNode, oldProps, newProps) {
  for (const name in oldProps) {
    if (RESERVED_PROPS.has(name)) continue
    if (!newProps || !(name in newProps)) {
      domNode.removeAttribute(name)
    }
  }
  for (let name in newProps) {
    if (RESERVED_PROPS.has(name)) continue
    const oldValue = oldProps && oldProps[name]
    const newValue = newProps[name]
    if (newValue !== oldValue) {
      domNode.setAttribute(name, newValue)
    }
  }
}

function updateRef (domNode, oldRefName, newRefName, refs) {
  if (newRefName !== oldRefName) {
    if (oldRefName && refs[oldRefName] === domNode) delete refs[oldRefName]
    if (newRefName) refs[newRefName] = domNode
  }
}

function updateEventListeners (domNode, oldListeners, newListeners) {
  for (const name in oldListeners) {
    if (!(newListeners && name in newListeners)) {
      domNode.removeEventListener(name, oldListeners[name])
    }
  }

  for (const name in newListeners) {
    const oldListener = oldListeners && oldListeners[name]
    const newListener = newListeners[name]

    if (newListener !== oldListener) {
      if (oldListener) domNode.removeEventListener(name, oldListener)
      domNode.addEventListener(name, newListener)
    }
  }
}
