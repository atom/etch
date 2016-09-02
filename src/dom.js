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
  return {
    tag: tag,
    properties: properties,
    children: children || []
  }
}
