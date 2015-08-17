import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import refsStack from './refs-stack'

export default function performElementUpdate (component) {
  let oldVirtualElement = component.virtualElement
  let newVirtualElement = component.render()
  refsStack.push(component.refs)
  patch(component.element, diff(oldVirtualElement, newVirtualElement))
  refsStack.pop()
  component.virtualElement = newVirtualElement
}
