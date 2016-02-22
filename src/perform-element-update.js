import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import refsStack from './refs-stack'

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
