const EVENT_LISTENER_PROPS = require('./event-listener-props')
const SVG_TAGS = require('./svg-tags')

function dom (tag, props, ...children) {
  const elem = {tag, props: null, children: []}

  if (props) {
    for (const propName in props) {
      // Check for the 'on' prefix before checking the property map. It's
      // slightly faster and it avoids a needless scope access.
      if (propName[0] === 'o' && propName[1] === 'n') {
        const eventName = EVENT_LISTENER_PROPS[propName]

        if (eventName) {
          if (!props.on) props.on = {}
          props.on[eventName] = props[propName]
        }
      }
    }

    if (props.class) props.className = props.class

    elem.props = props
  }

  while (children.length === 1 && Array.isArray(children[0])) {
    children = children[0]
  }

  // This pushdown automaton is used to flatten the children without recursion
  // and with minimal allocation. It makes performance much more predictable.
  //
  // Steps and transitions are explained inline.

  const childStack = []
  const indexStack = []
  let depth = 0
  let i = 0
  let j = 0

  while (true) {
    // If we finished all the children on the top of the stack...
    if (i === children.length) {
      // ...and we have nothing left to consume, we're done. We're returning the
      // element directly here to save a few lines.
      if (depth === 0) return elem
      // ...and we still have a child left to consume, pop it off.
      depth--
      children = childStack[depth]
      i = indexStack[depth]
    } else {
      // Else, check the child.
      const child = children[i]

      // If it's null, skip it. Else...
      if (child !== null) {
        if (typeof child === 'string' || typeof child === 'number') {
          // ...if it's a string or number, coerce it to a text node.
          elem.children[j++] = {text: child}
        } else if (Array.isArray(child)) {
          // ...if it's an array, push the current array and index to the stack
          // and start using the child. Continue the loop early without updating
          // the index since we already reset it to the correct start value.
          childStack[depth] = children
          indexStack[depth] = i
          depth++
          i = 0
          children = child
          continue
        } else if (typeof child === 'object') {
          // ...if it's an object, add it to the children, and continue on to
          // the next node.
          elem.children[j++] = child
        } else {
          // ...if it's anything else, complain, since we can't really make
          // sense of it.
          throw new Error(`Invalid child node: ${child}`)
        }
      }
    }

    // Finally, update the index by 1.
    i++
  }
}

const HTML_TAGS = [
  'a', 'abbr', 'address', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo',
  'blockquote', 'body', 'button', 'canvas', 'caption', 'cite', 'code',
  'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl',
  'dt', 'em', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2',
  'h3', 'h4', 'h5', 'h6', 'head', 'header', 'html', 'i', 'iframe', 'ins', 'kbd',
  'label', 'legend', 'li', 'main', 'map', 'mark', 'menu', 'meter', 'nav',
  'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'pre',
  'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section',
  'select', 'small', 'span', 'strong', 'style', 'sub', 'summary', 'sup',
  'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title',
  'tr', 'u', 'ul', 'var', 'video', 'area', 'base', 'br', 'col', 'command',
  'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source',
  'track', 'wbr'
]

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
