import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import dom from './dom'

export default Object.create(HTMLElement.prototype, {
  attachedCallback: {
    value: function () {
      if (this.detachSetImmediateHandle) {
        global.clearImmediate(this.detachSetImmediateHandle)
        this.detachSetImmediateHandle = null;
      } else {
        this.vnode = this.render()
        patch(this, diff(dom(this.tagName.toLowerCase()), this.vnode))
      }
    }
  },

  detachedCallback: {
    value: function () {
      this.detachSetImmediateHandle = global.setImmediate(() => {
        patch(this, diff(this.vnode, dom(this.tagName.toLowerCase())))
        this.detachSetImmediateHandle = null;
      })
    }
  }
})
