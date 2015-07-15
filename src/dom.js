'use babel';

import h from 'virtual-dom/h';
import PartialObservationWidget from './partial-observation-widget';
import {isScalarObservation} from './helpers';

export default function dom(tagName, attributes, ...children) {
  let properties = null;
  let hasObservationProperties = false;

  if (attributes) {
    properties = attributes.properties || {};
    delete attributes.properties;
    hasObservationProperties = hasObservationValues(attributes) || hasObservationValues(properties);
    properties.attributes = attributes;
  }

  if (hasObservationProperties) {
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
