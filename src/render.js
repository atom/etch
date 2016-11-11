import updateProps from './update-props'

export default function render (virtualNode, options) {
  let domNode
  if (virtualNode.text) {
    domNode = document.createTextNode(virtualNode.text)
  } else {
    const {tag, children} = virtualNode
    let {props} = virtualNode

    if (typeof tag === 'function') {
      let ref
      if (props && props.ref) {
        ({ref, ...props} = props)
      }
      const component = new tag(props || {}, children)
      virtualNode.component = component
      domNode = component.element
      if (options && options.refs && ref) {
        options.refs[ref] = component
      }
    } else {
      domNode = document.createElement(tag)
      if (children) addChildren(domNode, children, options)
      if (props) updateProps(domNode, null, virtualNode, options)
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
