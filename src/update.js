import {getScheduler} from './scheduler-assignment'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import refsStack from './refs-stack'

const componentsWithPendingUpdates = new WeakSet
let syncUpdatesInProgressCounter = 0

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
  if (newDomNode !== oldDomNode) {
    throw new Error("etch does not support changing the root DOM node type of a component")
  }

  syncUpdatesInProgressCounter--
}
