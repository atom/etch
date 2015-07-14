'use babel';

import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import {getScheduler} from './scheduler-assignment';

export default class WidgetObservation {
  constructor(observation) {
    this.type = 'Widget';
    this.observation = observation;
    this.domNode = null;
    this.vnode = null;
    this.observationSubscription = null;
  }

  init() {
    this.vnode = this.observation.getValue();
    this.domNode = createElement(this.vnode);
    this.observationSubscription = this.observation.onDidChangeValue((newVnode) => {
      getScheduler().updateDocument(() => {

        console.log('apply diff');

        patch(this.domNode, diff(this.vnode, newVnode));
        this.vnode = newVnode;
      });
    });
    return this.domNode;
  }

  update(previous, domNode) {
    this.domNode = domNode;
    this.vnode = observation.getValue();
    patch(domNode, diff(previous.vnode, this.vnode));
  }

  destroy() {
    this.observationSubscription.dispose();
  }
}
