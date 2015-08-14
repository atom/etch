import etchGlobal from './etch-global'
import createCustomElementPrototype from './create-custom-element-prototype'

const elementConstructors = etchGlobal[1].elementConstructors

export default function defineElement (tagName, elementSpec) {
  let customElementName = 'etch-' + tagName
  if (!elementConstructors[customElementName]) {
    elementConstructors[customElementName] = document.registerElement(customElementName, {
      extends: tagName,
      prototype: createCustomElementPrototype(
        Object.getPrototypeOf(document.createElement(tagName))
      )
    })
  }

  let elementPrototype = Object.create(elementConstructors[customElementName].prototype)
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

  let constructor = function () {
    let element = document.createElement(tagName, customElementName)
    Object.setPrototypeOf(element, elementPrototype)
    element.constructor = constructor
    element.createdCallback()
    return element
  }
  constructor.prototype = elementPrototype

  return constructor
}
