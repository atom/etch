const updateProps = require('./update-props')
const SVG_TAGS = require('./svg-tags')
const buildRefs = require('./build-refs')

function render (virtualNode, options) {
  let domNode
  if (virtualNode.text != null) {
    domNode = document.createTextNode(virtualNode.text)
  } else {
    const {tag, children} = virtualNode
    let {props} = virtualNode

    if (typeof tag === 'function') {
      let ref
      if (props && props.ref) {
        ref = props.ref
      }
      const component = new tag(props || {}, children)
      virtualNode.component = component
      domNode = component.element
      if (options && options.refs && ref) {
        options.refs = buildRefs.build(options.refs, ref, component)
      }
    } else if (SVG_TAGS.has(tag)) {
      domNode = document.createElementNS("http://www.w3.org/2000/svg", tag);
      if (children) addChildren(domNode, children, options)
      if (props) updateProps(domNode, null, virtualNode, options)
    } else {
      domNode = document.createElement(tag)
      if(props && props.ref){
        if (options && options.refs && props.ref) {
          options.refs = buildRefs.build(options.refs, props.ref, domNode)
        }
      }
      if (children) addChildren(domNode, children, options)
      if (props) updateProps(domNode, null, virtualNode, options)
    }
  }

  virtualNode.domNode = domNode
  return domNode
}

function addChildren (parent, children, options) {
  for (let i = 0; i < children.length; i++) {
    parent.appendChild(render(children[i], options))
  }
}

module.exports = render
