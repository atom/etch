export default function dom (tag, props, ...children) {

  for (let i = 0; i < children.length;) {
    const child = children[i]
    if (Array.isArray(child)) {
      children.splice(i, 1, ...child)
    } else if (typeof child === 'string') {
      children.splice(i, 1, {text: child})
      i++
    } else {
      i++
    }
  }

  return {tag, props, children}
}
