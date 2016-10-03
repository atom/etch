export default function render (virtualNode) {
  if (typeof virtualNode === 'string') {
    return document.createTextNode(virtualNode)
  } else {
    const {tag, props, children} = virtualNode

    if (typeof tag === 'function') {
      const component = new tag(props, children)
      return component.element
    } else {
      const element = document.createElement(tag)
      if (props) setAttributes(element, props)
      if (children) addChildren(element, children)
      return element
    }
  }
}

function setAttributes (element, props) {
  for (let name in props) {
    element.setAttribute(name, props[name])
  }
}

function addChildren (parent, children) {
  for (let child of children) {
    if (Array.isArray(child)) {
      addChildren(parent, child)
    } else {
      parent.appendChild(render(child))
    }
  }
}
