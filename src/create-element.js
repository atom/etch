'use babel';

import vdomCreateElement from 'virtual-dom/create-element';
import ObservationWidget from './observation-widget';

export default function createElement(arg) {
  let vnode;
  if (typeof arg.onDidChangeValue === 'function') {
    vnode = new ObservationWidget(arg);
  }

  return vdomCreateElement(vnode);
}
