import h from 'virtual-dom/h';
import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import {CompositeDisposable} from 'event-kit';
import {isScalarObservation} from './helpers';
import {getScheduler} from './scheduler-assignment';

export default class PartialObservationWidget {
  constructor(tagName, properties, children) {
    this.type = 'Widget';
    this.tagName = tagName;
    this.properties = properties;
    this.children = children;
    this.observationSubscriptions = new CompositeDisposable();
  }

  init() {
    this.vnode = this.getCurrentVnode()
    this.domNode = createElement(this.vnode);
    this.trackObservationProperties();
    return this.domNode;
  }

  update(previous, domNode) {
    this.domNode = domNode;
    this.vnode = this.getCurrentVnode();
    patch(domNode, diff(previous.vnode, this.vnode));
  }

  destroy() {
    this.observationSubscriptions.dispose();
  }

  getCurrentVnode() {
    return h(this.tagName, getCurrentPropertyValues(this.properties), this.children);
  }

  trackObservationProperties() {
    for (let key in this.properties) {
      let value = this.properties[key];
      if (key !== 'attributes' && isScalarObservation(value)) {
        this.observationSubscriptions.add(value.onDidChangeValue(newValue => {
          getScheduler().updateDocument(() => {
            this.domNode[key] = newValue;
          });
        }));
      }
    }

    if (this.properties.attributes) {
      for (let key in this.properties.attributes) {
        let value = this.properties.attributes[key];
        if (isScalarObservation(value)) {
          this.observationSubscriptions.add(value.onDidChangeValue(newValue => {
            getScheduler().updateDocument(() => {
              this.domNode.setAttribute(key, newValue);
            });
          }));
        }
      }
    }
  }
}

function getCurrentPropertyValues(inputProperties) {
  let outputProperties = {};

  for (let key in inputProperties) {
    let value = inputProperties[key];

    if (key === 'attributes') {
      outputProperties.attributes = getCurrentPropertyValues(value);
    } else {
      if (isScalarObservation(value)) {
        outputProperties[key] = value.getValue();
      } else {
        outputProperties[key] = value;
      }
    }
  }

  return outputProperties;
}
