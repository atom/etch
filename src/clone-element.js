/** @jsx etch.dom */

import etch from '../'

export default function cloneElement (el, props, children) {
  const newProps = {...el.properties, ...props}
  delete newProps.key
  delete newProps.ref
  if (el.key) {
    newProps.key = el.key
  }
  if (el.properties.ref) {
    const ref = el.properties.ref
    newProps.ref = ref.refName ? ref.refName : ref
  }
  return etch.dom(el.tagName || el.componentConstructor, newProps, children || el.children)
}
