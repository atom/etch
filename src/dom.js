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

    if (this.properties && this.properties.key) {
      this.key = this.properties.key
    }
  }

  init () {
    this.component = new this.constructor(this.properties, this.children)
    if (this.properties && this.properties.ref && refsStack.length > 0) {
      refsStack[refsStack.length - 1][this.properties.ref] = this.component
    }
    return this.component.element
  }

  update (oldWidget, oldElement) {
    let oldRef, newRef

    if (oldWidget.properties && oldWidget.properties.ref) {
      oldRef = oldWidget.properties.ref
    }

    if (this.properties && this.properties.ref) {
      newRef = this.properties.ref
    }

    if (this.constructor === oldWidget.constructor && typeof oldWidget.component.update === 'function') {
      if (newRef !== oldRef && refsStack.length > 0) {
        delete refsStack[refsStack.length - 1][oldRef]
        refsStack[refsStack.length - 1][newRef] = oldWidget.component
      }

      oldWidget.component.update(this.properties, this.children)
    } else {
      if (refsStack.length > 0) {
        if (newRef !== oldRef) {
          delete refsStack[refsStack.length - 1][oldRef]
        }
        if (newRef) {
          refsStack[refsStack.length - 1][newRef] = this.component
        }
      }

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
