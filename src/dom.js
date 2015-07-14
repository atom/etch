'use babel';

import h from 'virtual-dom/h';

export default function dom(tagName, attributes, ...children) {
  let properties = null;
  if (attributes) {
    properties = attributes.properties || {};
    delete attributes.properties;
    properties.attributes = attributes;
  }

  return h(tagName, properties, children);
}
