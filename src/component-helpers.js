import createElement from 'virtual-dom/create-element'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'

import refsStack from './refs-stack'
import {getScheduler} from './scheduler-assignment'

const componentsWithPendingUpdates = new WeakSet
let syncUpdatesInProgressCounter = 0
let syncDestructionsInProgressCounter = 0

// This function associates a component object with a DOM element by calling
// the components `render` method, assigning an `.element` property on the
// object and also returning the element.
//
// It also assigns a `virtualElement` property based on the return value of the
// `render` method. This will be used later by `performElementUpdate` to diff
// the new results of `render` with the previous results when updating the
// component's element.
//
// Finally, this function also associates the component with a `refs` object,
// which is populated with references to elements based on `ref` properties on
// nodes of the `virtual-dom` tree. Before calling into `virtual-dom` to create
// the DOM tree, it pushes this `refs` object to a shared stack so it can be
// accessed by hooks during the creation of individual elements.
export function initialize(component) {
  if (typeof component.update !== 'function') {
    throw new Error('Etch components must implement `update(props, children)`.')
  }

  component.refs = {}
  component.virtualElement = component.render()
  refsStack.push(component.refs)
  component.element = createElement(component.virtualElement)
  refsStack.pop()
}

// This function receives a component that has already been associated with an
// element via a previous call to `initialize` and updates this element by
// calling `render` on the component.
//
// When called in normal circumstances, it uses the scheduler to defer this
// update until the next animation frame, and will only perform one update of a
// given component in a given frame. This means you can call `update`
// repeatedly in a given tick without causing redundant updates.
//
// If this function called during another synchronous update (for example, as a
// result of a call to `update` on a child component), the update is performed
// synchronously.
//
// Returns a promise that will resolve when the requested update has been
// completed.
export function update (component) {
  if (syncUpdatesInProgressCounter > 0) {
    updateSync(component)
    return Promise.resolve()
  }

  let scheduler = getScheduler()

  if (!componentsWithPendingUpdates.has(component)) {
    componentsWithPendingUpdates.add(component)
    scheduler.updateDocument(function () {
      componentsWithPendingUpdates.delete(component)
      updateSync(component)
    })
  }

  return scheduler.getNextUpdatePromise()
}

// Synchronsly updates the DOM element associated with a component object. .
// This method assumes the presence of `.element` and `.virtualElement`
// properties on the component, which are assigned in the `initialize`
// function.
//
// It calls `render` on the component to obtain the desired state of the DOM,
// then `diff`s it with the previous state and `patch`es the element based on
// the resulting diff. During the patch operation, it pushes the component's
// `refs` object to a shared stack so that references to DOM elements can be
// updated.
//
// If `update` is called during the invocation of `updateSync`,
// the requests are processed synchronously as well. We track whether this is
// the case by incrementing and decrementing `syncUpdatesInProgressCounter`
// around the call.
//
// For now, etch does not allow the root tag of the `render` method to change
// between invocations, because we want to preserve a one-to-one relationship
// between component objects and DOM elements for simplicity.
export function updateSync (component) {
  syncUpdatesInProgressCounter++

  let oldVirtualElement = component.virtualElement
  let oldDomNode = component.element
  let newVirtualElement = component.render()
  refsStack.push(component.refs)
  let newDomNode = patch(component.element, diff(oldVirtualElement, newVirtualElement))
  refsStack.pop()
  component.virtualElement = newVirtualElement
  component.element = newDomNode

  syncUpdatesInProgressCounter--
}

// Removes the component's associated element and calls `destroy` on any child
// components. Normally, this function is asynchronous and will perform the
// destruction on the next animation frame. If called as the result of another
// update or destruction, it calls `destroy` on child components synchronously.
// If called as the result of destroying a component higher in the DOM, the
// element is not removed to avoid redundant DOM manipulation. Returns a promise
// that resolves when the destruction is completed.
export function destroy (component) {
  if (syncUpdatesInProgressCounter > 0 || syncDestructionsInProgressCounter > 0) {
    destroySync(component)
    return Promise.resolve()
  }

  let scheduler = getScheduler()
  scheduler.updateDocument(function () {
    destroySync(component)
  })
  return scheduler.getNextUpdatePromise()
}

// A synchronous version of `destroy`.
//
// Note that we track whether `destroy` calls are in progress and only remove
// the element if we are not a nested call.
export function destroySync (component) {
  syncDestructionsInProgressCounter++
  destroyChildComponents(component.virtualElement)
  if (syncDestructionsInProgressCounter === 1) component.element.remove()
  syncDestructionsInProgressCounter--
}

function destroyChildComponents(virtualNode) {
  if (virtualNode.type === 'Widget') {
    if (virtualNode.component && typeof virtualNode.component.destroy === 'function') {
      virtualNode.component.destroy()
    }
  } else if (virtualNode.children) {
    virtualNode.children.forEach(destroyChildComponents)
  }
}

export function fromFunction (renderFn) {
  class EtchStateless {
    constructor (props, children) {
      this.props = props
      this.children = children
      initialize(this)
    }

    update (props, children) {
      this.props = props
      this.children = children
      return update(this)
    }

    render () {
      return renderFn(this.props, this.children)
    }
  }

  return EtchStateless
}
