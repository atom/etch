import createElement from 'virtual-dom/create-element'
import refsStack from './refs-stack'

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
export default function initialize(component) {
  component.refs = {}
  component.virtualElement = component.render()
  refsStack.push(component.refs)
  component.element = createElement(component.virtualElement)
  refsStack.pop()
  return component.element
}
