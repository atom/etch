import h from 'virtual-dom/h'
import refsStack from './refs-stack'

export default function dom (tag, properties, ...children) {
  if (typeof tag === 'function') {
    return new ComponentWidget(tag, properties, children)
  } else {
    if (properties && properties.ref) {
      properties.ref = new RefHook(properties.ref)
    }
    return h(tag, properties, children)
  }
}

class ComponentWidget {
  constructor (constructor, properties, children) {
    this.type = 'Widget'
    this.constructor = constructor
    this.properties = properties
    this.children = children
  }

  init () {
    this.component = new this.constructor(this.properties, this.children)
    return this.component.element
  }

  update (oldWidget, oldElement) {
    if (this.constructor === oldWidget.constructor && typeof oldWidget.component.update === 'function') {
      oldWidget.component.update(this.properties, this.children)
    } else {
      let newElement = this.init()
      oldElement.parentNode.replaceChild(newElement, oldElement)
    }
  }
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
