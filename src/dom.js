import h from 'virtual-dom/h'
import FullObservationWidget from './full-observation-widget'
import PartialObservationWidget from './partial-observation-widget'
import {isScalarObservation, isArrayObservation} from './helpers'
import refsStack from './refs-stack'

export default function dom (tagName, properties, ...children) {
  let hasObservationProperties = false
  let hasArrayObservationChildren = false

  if (properties) {
    hasObservationProperties =
      hasObservationValues(properties) ||
        properties.attributes && hasObservationValues(properties.attributes)

    if (properties.ref) {
      properties.ref = new RefHook(properties.ref)
    }
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

class RefHook {
  constructor (refName) {
    this.refName = refName
  }

  hook (node) {
    if (refsStack.length > 0) {
      refsStack[refsStack.length - 1][this.refName] = node
    }
  }

  unhook (node) {
    if (refsStack.length > 0) {
      delete refsStack[refsStack.length - 1][this.refName]
    }
  }
}
