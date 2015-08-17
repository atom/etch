import virtualDOMCreateElement from 'virtual-dom/create-element'
import refsStack from './refs-stack'

export default function createElement(component) {
  component.refs = {}
  component.virtualElement = component.render()
  refsStack.push(component.refs)
  component.element = virtualDOMCreateElement(component.virtualElement)
  refsStack.pop()
  return component.element
}
