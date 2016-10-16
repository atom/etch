import EVENT_LISTENER_PROPS from './event-listener-props'

export default function dom (tag, props, ...children) {
  for (let i = 0; i < children.length;) {
    const child = children[i]
    if (Array.isArray(child)) {
      children.splice(i, 1, ...child)
    } else if (typeof child === 'string') {
      children.splice(i, 1, {text: child})
      i++
    } else {
      i++
    }
  }

  if (props) {
    for (const propName in props) {
      const eventName = EVENT_LISTENER_PROPS[propName]
      if (eventName) {
        if (!props.on) props.on = {}
        props.on[eventName] = props[propName]
      }
    }
  }

  return {tag, props, children}
}
