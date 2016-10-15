export default function render (virtualNode, options) {
  let domNode
  if (virtualNode.text) {
    domNode = document.createTextNode(virtualNode.text)
  } else {
    const {tag, props, children} = virtualNode

    if (typeof tag === 'function') {
      const component = new tag(props, children)
      virtualNode.component = component
      domNode = component.element
      if (options && options.refs && props.ref) {
        options.refs[props.ref] = component
      }
    } else {
      domNode = document.createElement(tag)
      if (children) addChildren(domNode, children, options)
      if (props) addProps(domNode, props, options && options.refs)
    }
  }
  virtualNode.domNode = domNode
  return domNode
}

function addChildren (parent, children, options) {
  for (let child of children) {
    parent.appendChild(render(child, options))
  }
}

function addProps (domNode, props, refs) {
  for (const name in props) {
    const value = props[name]
    if (name === 'ref') {
      if (refs) refs[value] = domNode
    } else {
      domNode.setAttribute(name, value)
    }
  }
}
