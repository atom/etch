export default function render (virtualNode) {
  let domNode
  if (virtualNode.text) {
    domNode = document.createTextNode(virtualNode.text)
  } else {
    const {tag, props, children} = virtualNode

    if (typeof tag === 'function') {
      const component = new tag(props, children)
      domNode = component.element
    } else {
      domNode = document.createElement(tag)
      if (props) setAttributes(domNode, props)
      if (children) addChildren(domNode, children)
    }
  }
  virtualNode.domNode = domNode
  return domNode
}

function setAttributes (domNode, props) {
  for (let name in props) {
    domNode.setAttribute(name, props[name])
  }
}

function addChildren (parent, children) {
  for (let child of children) {
    parent.appendChild(render(child))
  }
}
