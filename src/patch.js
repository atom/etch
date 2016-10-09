import virtualNodesByElement from './virtual-nodes-by-element'

export default function patch (element, newVirtualNode) {
  const oldVirtualNode = virtualNodesByElement.get(element)
  if (!oldVirtualNode) throw new Error('No virtual node found for element. You can currently only patch elements produced via the render or patch functions.')

  patchAttributes(element, oldVirtualNode, newVirtualNode)
}

function patchAttributes(element, oldVirtualNode, newVirtualNode) {
  const oldProps = oldVirtualNode.props
  const newProps = newVirtualNode.props

  for (let prop in oldProps) {
    if (!(prop in newProps)) element.removeAttribute(prop)
  }
  for (let prop in newProps) {
    const newValue = newProps[prop]
    if (newValue !== oldProps[prop]) element.setAttribute(prop, newValue)
  }
}
