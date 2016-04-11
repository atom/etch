import refsStack from './refs-stack'

// Instances of this class interface with an [extension mechanism](https://github.com/Matt-Esch/virtual-dom/blob/master/docs/widget.md)
// in the `virtual-dom` library that allows us to manually manage specific DOM
// nodes within a `virtual-dom` tree. It is designed to wrap a *component*,
// which is just a plain JavaScript object that implements a simple interface.
export default class ComponentWidget {
  constructor (componentConstructor, properties, children) {
    this.type = 'Widget'
    this.componentConstructor = componentConstructor
    this.properties = properties
    this.children = children

    if (this.properties && this.properties.key) {
      this.key = this.properties.key
    }
  }

  // The `virtual-dom` library expects this method to return a DOM node. It
  // calls this method when creating a DOM tree for the first time or when
  // updating a DOM tree via patch. We create an instance of the component based
  // on the constructor we saved when the widget was created, deal with the
  // `ref` property if it is present, then return the component's associated DOM
  // element.
  init () {
    this.component = new this.componentConstructor(this.properties, this.children)
    if (this.properties && this.properties.ref && refsStack.length > 0) {
      refsStack[refsStack.length - 1][this.properties.ref] = this.component
    }
    return this.component.element
  }

  // The `virtual-dom` library calls this method when applying updates to the
  // DOM by `diff`ing two virtual trees and then `patch`ing an element.
  //
  // If a widget with the same `componentConstructor` occurs at the same
  // location of the tree, we attempt to update the underlying component by
  // calling the `update` method with the component's new properties and
  // children. If the component doesn't have an `update` method or if the
  // widgets have *different* component constructors, we destroy the old
  // component and build a new one in its place.
  update (oldWidget, oldElement) {
    let oldRef, newRef

    if (oldWidget.properties && oldWidget.properties.ref) {
      oldRef = oldWidget.properties.ref
    }

    if (this.properties && this.properties.ref) {
      newRef = this.properties.ref
    }

    if (this.componentConstructor === oldWidget.componentConstructor) {
      this.component = oldWidget.component

      // If the ref properties have changed, delete the old reference and create
      // a new reference to this widget's component.
      if (newRef !== oldRef && refsStack.length > 0) {
        delete refsStack[refsStack.length - 1][oldRef]
        refsStack[refsStack.length - 1][newRef] = this.component
      }

      this.component.update(this.properties, this.children)
    } else {
      // If `ref` properties are defined, delete the reference to the old
      // component. Only do this if the reference name changed because otherwise
      // the new reference (created in the call to `this.init`) will overwrite
      // the old one anyway.
      if (refsStack.length > 0) {
        if (newRef !== oldRef) {
          delete refsStack[refsStack.length - 1][oldRef]
        }
      }

      // Build a new component instance by calling `init`.
      let newElement = this.init()

      // Finally, replace the old component's DOM element with the new
      // component's DOM element.
      return newElement
    }
  }

  destroy () {
    if (typeof this.component.destroy === 'function') {
      this.component.destroy()
    }
  }
}
