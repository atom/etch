'use babel';

import h from 'virtual-dom/h';
import PartialObservationWidget from './partial-observation-widget';
import {isScalarObservation, isArrayObservation} from './helpers';

export default function dom(tagName, attributes, ...children) {
  let properties = null;
  let hasObservationProperties = false;
  let hasObservationChildren = false;

  if (attributes) {
    properties = attributes.properties || {};
    delete attributes.properties;
    hasObservationProperties = hasObservationValues(attributes) || hasObservationValues(properties);
    properties.attributes = attributes;
  }

  for (let child of children) {
    if (isArrayObservation(child)) {
      hasObservationChildren = true;
      break;
    }
  }

  if (hasObservationProperties || hasObservationChildren) {
    return new PartialObservationWidget(tagName, properties, children);
  } else {
    return h(tagName, properties, children);
  }
}

function hasObservationValues(object) {
  for (let key in object) {
    if (isScalarObservation(object[key])) {
      return true;
    }
  }
  return false;
}
