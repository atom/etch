import h from 'virtual-dom/h'
import createElement from 'virtual-dom/create-element'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import {CompositeDisposable} from 'event-kit'
import {isScalarObservation, isArrayObservation} from './helpers'
import {getScheduler} from './scheduler-assignment'

export default class PartialObservationWidget {
  constructor (tagName, properties, children) {
    this.type = 'Widget'
    this.tagName = tagName
    this.properties = properties
    this.children = children
    this.observationSubscriptions = new CompositeDisposable()
    this.vnode = null
    this.domNode = null
    this.childObservationIndexTrackers = null
  }

  init () {
    this.trackObservationProperties()
    this.trackObservationChildren()
    this.vnode = this.getCurrentVnode()
    this.domNode = createElement(this.vnode)
    return this.domNode
  }

  update (previous, domNode) {
    this.domNode = domNode
    this.trackObservationProperties()
    this.trackObservationChildren()
    this.vnode = this.getCurrentVnode()
    patch(domNode, diff(previous.vnode, this.vnode))
    previous.destroy()
  }

  destroy () {
    this.observationSubscriptions.dispose()
    this.observationSubscriptions = null
    this.vnode = null
    this.domNode = null
  }

  getCurrentVnode () {
    return h(this.tagName, getCurrentPropertyValues(this.properties), this.children)
  }

  trackObservationProperties () {
    if (!this.properties) {
      return
    }

    for (let key in this.properties) {
      let value = this.properties[key]
      if (key !== 'attributes' && isScalarObservation(value)) {
        this.properties[key] = value.getValue()
        this.observationSubscriptions.add(value.onDidChangeValue(newValue => {
          getScheduler().updateDocument(() => {
            if (this.domNode) {
              this.vnode.properties[key] = newValue
              this.domNode[key] = newValue
            }
          })
        }))
      }
    }

    if (this.properties.attributes) {
      for (let key in this.properties.attributes) {
        let value = this.properties.attributes[key]
        if (isScalarObservation(value)) {
          this.properties.attributes[key] = value.getValue()
          this.observationSubscriptions.add(value.onDidChangeValue(newValue => {
            getScheduler().updateDocument(() => {
              if (this.domNode) {
                this.vnode.properties.attributes[key] = newValue
                this.domNode.setAttribute(key, newValue)
              }
            })
          }))
        }
      }
    }
  }

  trackObservationChildren () {
    let i = 0
    while (i < this.children.length) {
      let child = this.children[i]
      if (isArrayObservation(child)) {
        let indexTracker = {index: i}
        this.childObservationIndexTrackers = this.childObservationIndexTrackers || []
        this.childObservationIndexTrackers.push(indexTracker)

        let observationValues = child.getValues()
        this.children.splice(i, 1, ...observationValues)
        i += observationValues.length

        this.observationSubscriptions.add(child.onDidChangeValues(changes => {
          this.childObservationDidChange(indexTracker, changes)
        }))
      } else {
        i++
      }
    }
  }

  childObservationDidChange (indexTracker, changes) {
    getScheduler().updateDocument(() => {
      if (this.domNode) {
        let totalDelta = 0
        for (let {index, removedCount, added} of changes) {
          let childIndex = indexTracker.index + index
          totalDelta += added.length - removedCount
          spliceDOMChildren(this.domNode, childIndex, removedCount, added.map(createElement))
          this.vnode.children.splice(childIndex, removedCount, ...added)
        }

        for (let otherTracker of this.childObservationIndexTrackers) {
          if (otherTracker.index > indexTracker.index) {
            otherTracker.index += totalDelta
          }
        }
      }
    })
  }
}

function getCurrentPropertyValues (inputProperties) {
  let outputProperties = {}

  for (let key in inputProperties) {
    let value = inputProperties[key]

    if (key === 'attributes') {
      outputProperties.attributes = getCurrentPropertyValues(value)
    } else {
      if (isScalarObservation(value)) {
        outputProperties[key] = value.getValue()
      } else {
        outputProperties[key] = value
      }
    }
  }

  return outputProperties
}

function spliceDOMChildren (parent, index, removeCount, add) {
  while (removeCount > 0) {
    parent.removeChild(parent.children[index])
    removeCount--
  }

  let nextIndex = index
  while (add.length) {
    parent.insertBefore(add.shift(), parent.children[nextIndex])
    nextIndex++
  }
}
