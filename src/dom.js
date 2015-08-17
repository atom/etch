import h from 'virtual-dom/h'
import refsStack from './refs-stack'

export default function dom (tagName, properties, ...children) {
  if (properties && properties.ref) {
    properties.ref = new RefHook(properties.ref)
  }
  return h(tagName, properties, children)
}

class RefHook {
  constructor (refName) {
    this.refName = refName
  }

  hook (node) {
    if (refsStack.length > 0) {
      refsStack[refsStack.length - 1][this.refName] = node
    }
  }

  unhook (node) {
    if (refsStack.length > 0) {
      delete refsStack[refsStack.length - 1][this.refName]
    }
  }
}
