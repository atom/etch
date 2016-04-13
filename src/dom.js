import h from 'virtual-dom/h'
import svg from 'virtual-dom/virtual-hyperscript/svg'
import RefHook from './ref-hook'
import ComponentWidget from './component-widget'

// taken from https://github.com/facebook/react/blob/67f8524e88abbf1ac0fd86d38a0477d11fbc7b3e/src/isomorphic/classic/element/ReactDOMFactories.js#L153
const SVG_TAGS = [
  'circle',
  'clipPath',
  'defs',
  'ellipse',
  'g',
  'image',
  'line',
  'linearGradient',
  'mask',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'svg',
  'text',
  'tspan'
]

// This function is invoked by JSX expressions to construct `virtual-dom` trees.
//
// For normal HTML tags (when the `tag` parameter is a string), we call through
// to `h`, the virtual-dom library's method for building virtual nodes.
//
// If the user passes a *constructor*, however, we build a special "widget"
// instance to manage the component. [Widgets](https://github.com/Matt-Esch/virtual-dom/blob/master/docs/widget.md)
// are an extension mechanism in the virtual-dom API that allows us to control
// a particular DOM element directly using native DOM APIs. This allows the
// component to manage its DOM element using whatever mechanism it desires,
// independent of the fact that its containing DOM tree is managed by this
// particular library. For more information, see `./component-widget.js`.
export default function dom (tag, properties, ...children) {
  if (typeof tag === 'function') {
    return new ComponentWidget(tag, properties, children)
  } else {
    // Etch allows for a special `ref` property, which will automatically create
    // named references to DOM elements containing the property. We implement
    // this with virtual-dom's [hook system](https://github.com/Matt-Esch/virtual-dom/blob/master/docs/hooks.md),
    // which allows a particular property to be associated with behavior when
    // the element is created or destroyed.
    if (properties && properties.ref) {
      properties.ref = new RefHook(properties.ref)
    }

    if (SVG_TAGS.includes(tag)) {
      if (properties && properties.className) {
        properties['class'] = properties.className
        delete properties.className
      }
      return svg(tag, properties, children)
    } else {
      return h(tag, properties, children)
    }
  }
}
