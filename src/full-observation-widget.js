'use babel';

import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import {getScheduler} from './scheduler-assignment';

export default class FullObservationWidget {
  constructor(observation) {
    this.type = 'Widget';
    this.observation = observation;
    this.domNode = null;
    this.vnode = null;
    this.observationSubscription = null;
  }

  init() {
    this.trackObservation();
    this.vnode = this.observation.getValue();
    this.domNode = createElement(this.vnode);
    return this.domNode;
  }

  update(previous, domNode) {
    this.domNode = domNode;
    this.trackObservation();
    this.vnode = this.observation.getValue();
    patch(domNode, diff(previous.vnode, this.vnode));
    previous.destroy()
  }

  destroy() {
    this.observationSubscription.dispose();
    this.observationSubscription = null;
    this.domNode = null;
    this.vnode = null;
  }

  trackObservation() {
    this.observationSubscription = this.observation.onDidChangeValue((newVnode) => {
      getScheduler().updateDocument(() => {
        if (this.domNode) {
          patch(this.domNode, diff(this.vnode, newVnode));
          this.vnode = newVnode;
        }
      });
    });
  }
}
