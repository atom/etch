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

  for (const eventName in oldListeners) {
    if (!(newListeners && eventName in newListeners)) {
      let listenerToRemove
      if (oldVirtualNode && oldVirtualNode.boundListeners && oldVirtualNode.boundListeners[eventName]) {
        listenerToRemove = oldVirtualNode.boundListeners[eventName]
      } else {
        listenerToRemove =oldListeners[eventName]
      }
      domNode.removeEventListener(eventName, listenerToRemove)
    }
  }

  for (const eventName in newListeners) {
    const oldListener = oldListeners && oldListeners[eventName]
    const newListener = newListeners[eventName]

    if (newListener !== oldListener) {
      if (oldListener) {
        let listenerToRemove
        if (oldVirtualNode && oldVirtualNode.boundListeners && oldVirtualNode.boundListeners[eventName]) {
          listenerToRemove = oldVirtualNode.boundListeners[eventName]
        } else {
          listenerToRemove = oldListener
        }
        domNode.removeEventListener(eventName, listenerToRemove)
      }
      let listenerToAdd
      if (listenerContext) {
        listenerToAdd = newListener.bind(listenerContext)
        if (!newVirtualNode.boundListeners) newVirtualNode.boundListeners = {}
        newVirtualNode.boundListeners[eventName] = listenerToAdd
      } else {
        listenerToAdd = newListener
      }
      domNode.addEventListener(eventName, listenerToAdd)
    }
  }
}
