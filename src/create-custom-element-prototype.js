/* global HTMLElement */

import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import dom from './dom'
import {getScheduler} from './scheduler-assignment'
import refsStack from './refs-stack'

export default function createCustomElementPrototype (nativePrototype) {
  return Object.create(nativePrototype, {
    createdCallback: {
      value: function () {
        if (isElementUnregistered(this)) {
          return
        }

        this.refs = {}
        this._setImmediateHandle = null
        this._attached = false
        this._updateRequested = false

        if (typeof this._createdCallback === 'function') {
          this._createdCallback()
        }
      }
    },

    attachedCallback: {
      value: function () {
        if (isElementUnregistered(this)) {
          return
        }

        this._attached = true

        if (this._setImmediateHandle) {
          global.clearImmediate(this._setImmediateHandle)
          this._setImmediateHandle = null
        } else {
          this.vnode = dom(this.tagName.toLowerCase())
          this.updateSync()
        }

        if (typeof this._attachedCallback === 'function') {
          this._attachedCallback()
        }
      }
    },

    detachedCallback: {
      value: function () {
        if (isElementUnregistered(this)) {
          return
        }

        this._attached = false

        if (typeof this._detachedCallback === 'function') {
          this._detachedCallback()
        }

        this._setImmediateHandle = global.setImmediate(() => {
          patch(this, diff(this.vnode, dom(this.tagName.toLowerCase())))
          this.vnode = null
          this._setImmediateHandle = null
        })
      }
    },

    attributeChangedCallback: {
      value: function (attributeName, oldValue, newValue) {
        if (typeof this._attributeChangedCallback === 'function') {
          this.attributeChangedCallback(attributeName, oldValue, newValue)
        }
      }
    },

    isAttached: {
      value: function () {
        return this._attached
      }
    },

    update: {
      value: function () {
        if (!this._updateRequested) {
          this._updateRequested = true
          getScheduler().updateDocument(() => {
            this._updateRequested = false
            this.updateSync()
          })
        }
      }
    },

    updateSync: {
      value: function () {
        if (this.isAttached()) {
          refsStack.push(this.refs)
          let newVnode = this.render()
          patch(this, diff(this.vnode, newVnode))
          this.vnode = newVnode
          refsStack.pop()
          return true
        } else {
          return false
        }
      }
    }
  })

  function isElementUnregistered (element) {
    return Object.getPrototypeOf(Object.getPrototypeOf(element)) === nativePrototype
  }
}
