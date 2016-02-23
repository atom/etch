import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import refsStack from './refs-stack'

// This helper function is called by both `updateElement` and
// `updateElementSync` to update the DOM element associated with a component
// object. This method assumes the presence of `.element` and `.virtualElement`
// properties on the component object, which are automatically assigned by the
// `createElement` function.
//
// It calls `render` on the component to obtain the desired state of the DOM,
// then `diff`s it with the previous state and `patch`es the element based on
// the resulting diff. During the patch operation, it pushes the component's
// `refs` object to a shared stack so that references to DOM elements can be
// updated.
//
// For now, etch does not allow the root tag of the `render` method to change
// between invocations, because we want to preserve a one-to-one relationship
// between component objects and DOM elements for simplicity.
export default function performElementUpdate (component) {
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
}
