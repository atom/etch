'use babel';

import vdomCreateElement from 'virtual-dom/create-element';
import FullObservationWidget from './full-observation-widget';

export default function createElement(arg) {
  let vnode;
  if (typeof arg.onDidChangeValue === 'function') {
    vnode = new FullObservationWidget(arg);
  } else {
    vnode = arg;
  }
  return vdomCreateElement(vnode);
}
