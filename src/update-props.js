const RESERVED_PROPS = new Set(['on', 'ref'])

export default function updateProps(domNode, oldVirtualNode, newVirtualNode, options) {
  const oldProps = oldVirtualNode && oldVirtualNode.props
  const newProps = newVirtualNode.props

  let refs, listenerContext
  if (options) {
    refs = options.refs
    listenerContext = options.listenerContext
  }
  updateAttributes(domNode, oldProps, newProps)
  if (refs) updateRef(domNode, oldProps && oldProps.ref, newProps && newProps.ref, refs)
  updateEventListeners(domNode, oldVirtualNode, newVirtualNode, listenerContext)
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

function updateEventListeners (domNode, oldVirtualNode, newVirtualNode, listenerContext) {
  const oldListeners = oldVirtualNode && oldVirtualNode.props && oldVirtualNode.props.on
  const newListeners = newVirtualNode.props && newVirtualNode.props.on

  for (const name in oldListeners) {
    if (!(newListeners && name in newListeners)) {
      let listenerToRemove
      if (oldVirtualNode && oldVirtualNode.boundListeners && oldVirtualNode.boundListeners[name]) {
        listenerToRemove = oldVirtualNode.boundListeners[name]
      } else {
        listenerToRemove =oldListeners[name]
      }
      domNode.removeEventListener(name, listenerToRemove)
    }
  }

  for (const name in newListeners) {
    const oldListener = oldListeners && oldListeners[name]
    const newListener = newListeners[name]

    if (newListener !== oldListener) {
      if (oldListener) {
        let listenerToRemove
        if (oldVirtualNode && oldVirtualNode.boundListeners && oldVirtualNode.boundListeners[name]) {
          listenerToRemove = oldVirtualNode.boundListeners[name]
        } else {
          listenerToRemove = oldListener
        }
        domNode.removeEventListener(name, listenerToRemove)
      }
      let listenerToAdd
      if (listenerContext) {
        listenerToAdd = newListener.bind(listenerContext)
        if (!newVirtualNode.boundListeners) newVirtualNode.boundListeners = {}
        newVirtualNode.boundListeners[name] = listenerToAdd
      } else {
        listenerToAdd = newListener
      }
      domNode.addEventListener(name, listenerToAdd)
    }
  }
}
