import virtualNodesByElement from './virtual-nodes-by-element'

export default function render (virtualNode) {
  let element
  if (virtualNode.text) {
    element = document.createTextNode(virtualNode.text)
  } else {
    const {tag, props, children} = virtualNode

    if (typeof tag === 'function') {
      const component = new tag(props, children)
      element = component.element
    } else {
      element = document.createElement(tag)
      if (props) setAttributes(element, props)
      if (children) addChildren(element, children)
    }
  }
  virtualNode.element = element
  virtualNodesByElement.set(element, virtualNode)
  return element
}

function setAttributes (element, props) {
  for (let name in props) {
    element.setAttribute(name, props[name])
  }
}

function addChildren (parent, children) {
  for (let child of children) {
    parent.appendChild(render(child))
  }
}
