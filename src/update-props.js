import EVENT_LISTENER_PROPS from './event-listener-props'

export default function (domNode, oldVirtualNode, newVirtualNode, options) {
  const oldProps = oldVirtualNode && oldVirtualNode.props
  const newProps = newVirtualNode.props

  let refs, listenerContext
  if (options) {
    refs = options.refs
    listenerContext = options.listenerContext
  }
  updateProps(domNode, oldProps, newProps)
  if (refs) updateRef(domNode, oldProps && oldProps.ref, newProps && newProps.ref, refs)
  updateEventListeners(domNode, oldVirtualNode, newVirtualNode, listenerContext)
}

function updateProps (domNode, oldProps, newProps) {
  if (oldProps) {
    const oldPropsNames = Object.keys(oldProps)
    for (let i = 0; i < oldPropsNames.length; i++) {
      const name = oldPropsNames[i]
      if (name === 'ref' || name === 'on') continue
      if (name in EVENT_LISTENER_PROPS) continue
      if (!newProps || !(name in newProps)) {
        if (name === 'dataset') {
          updateProps(domNode.dataset, oldProps ? oldProps.dataset : null, null)
        } else if (name === 'style') {
          updateProps(domNode.style, oldProps ? oldProps.style : null, null)
        } else {
          delete domNode[name]
        }
      }
    }
  }

  if (newProps) {
    const newPropsNames = Object.keys(newProps)
    for (let i = 0; i < newPropsNames.length; i++) {
      const name = newPropsNames[i]
      if (name === 'ref' || name === 'on') continue
      if (name in EVENT_LISTENER_PROPS) continue
      const oldValue = oldProps && oldProps[name]
      const newValue = newProps[name]
      if (name === 'dataset') {
        updateProps(domNode.dataset, oldProps ? oldProps.dataset : null, newProps.dataset)
      } else if (name === 'style') {
        updateProps(domNode.style, oldProps ? oldProps.style : null, newProps.style)
      } else {
        if (newValue !== oldValue) {
          domNode[name] = newValue
        }
      }
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
