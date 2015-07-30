import h from 'virtual-dom/h'
import FullObservationWidget from './full-observation-widget'
import PartialObservationWidget from './partial-observation-widget'
import {isScalarObservation, isArrayObservation} from './helpers'

export default function dom (tagName, properties, ...children) {
  let hasObservationProperties = false
  let hasArrayObservationChildren = false

  if (properties) {
    hasObservationProperties =
      hasObservationValues(properties) ||
        properties.attributes && hasObservationValues(properties.attributes)
  }

  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    if (isScalarObservation(child)) {
      children[i] = new FullObservationWidget(child)
    } else if (isArrayObservation(child)) {
      hasArrayObservationChildren = true
    }
  }

  if (hasObservationProperties || hasArrayObservationChildren) {
    return new PartialObservationWidget(tagName, properties, children)
  } else {
    return h(tagName, properties, children)
  }
}

function hasObservationValues (object) {
  for (let key in object) {
    if (isScalarObservation(object[key])) {
      return true
    }
  }
  return false
}
