/* global HTMLElement */

import createCustomElementPrototype from './create-custom-element-prototype'

if (!global.__etch__) {
  global.__etch__ = {
    1: {
      elementConstructors: {}
    }
  }
}

let elementConstructors = global.__etch__[1].elementConstructors
const ElementPrototype = createCustomElementPrototype(HTMLElement.prototype)

export default function registerElement (elementName, elementSpec) {
  let elementPrototype = Object.create(ElementPrototype)

  for (let key in elementSpec) {
    switch (key) {
      case 'createdCallback':
        elementPrototype._createdCallback = elementSpec.createdCallback
        break
      case 'attachedCallback':
        elementPrototype._attachedCallback = elementSpec.attachedCallback
        break
      case 'detachedCallback':
        elementPrototype._detachedCallback = elementSpec.detachedCallback
        break
      case 'attributeChangedCallback':
        elementPrototype._attributeChangedCallback = elementSpec.attributeChangedCallback
        break
      default:
        elementPrototype[key] = elementSpec[key]
        break
    }
  }

  let elementConstructor = elementConstructors[elementName]

  if (elementConstructor) {
    if (Object.getPrototypeOf(elementConstructor.prototype) !== HTMLElement.prototype) {
      throw new Error(`Already registered element ${elementName}. Call .unregister() on the previously-registered element constructor before registering another element with the same name.`)
    }
    Object.setPrototypeOf(elementConstructor.prototype, elementPrototype)
    return elementConstructor
  } else {
    elementConstructor = document.registerElement(elementName, {prototype: Object.create(elementPrototype)})
    elementConstructor.unregister = () => {
      if (Object.getPrototypeOf(elementConstructor.prototype) === HTMLElement.prototype) {
        throw new Error(`Already unregistered element ${elementName}`)
      } else {
        Object.setPrototypeOf(elementConstructor.prototype, HTMLElement.prototype)
      }
    }
    elementConstructors[elementName] = elementConstructor
    return elementConstructor
  }
}
