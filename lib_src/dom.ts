const EVENT_LISTENER_PROPS = require('./event-listener-props')
const SVG_TAGS = require('./svg-tags')
import {HTML_TAGS} from './html-tags'

function dom (tag, props, ...children) {
  let ambiguous = []

  for (let i = 0; i < children.length;) {
    const child = children[i]
    switch (typeof child) {
      case 'string':
      case 'number':
        children[i] = {text: child}
        i++
        break;

      case 'object':
        if (Array.isArray(child)) {
          children.splice(i, 1, ...child)
        } else if (!child) {
          children.splice(i, 1)
        } else {
          if (!child.context) {
            ambiguous.push(child)
            if (child.ambiguous && child.ambiguous.length) {
              ambiguous = ambiguous.concat(child.ambiguous)
            }
          }
          i++
        }
        break;

      default:
        throw new Error(`Invalid child node: ${child}`)
    }
  }

  if (props) {
    for (const propName in props) {
      const eventName = EVENT_LISTENER_PROPS[propName]
      if (eventName) {
        if (!props.on) props.on = {}
        props.on[eventName] = props[propName]
      }
    }

    if (props.class) {
      props.className = props.class
    }
  }

  return {tag, props, children, ambiguous}
}


for (const tagName of HTML_TAGS) {
  dom[tagName] = (props, ...children) => {
    return dom(tagName, props, ...children)
  }
}

for (const tagName of SVG_TAGS) {
  dom[tagName] = (props, ...children) => {
    return dom(tagName, props, ...children)
  }
}


module.exports = dom
