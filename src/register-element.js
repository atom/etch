let elementConstructors = {}

export default function registerElement (elementName, elementSpec) {
  let elementPrototype = Object.create(HTMLElement.prototype)
  for (let key in elementSpec) {
    elementPrototype[key] = elementSpec[key]
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
