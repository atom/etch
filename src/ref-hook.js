import refsStack from './refs-stack'

// Instances of this class interface with an [extension mechanism](https://github.com/Matt-Esch/virtual-dom/blob/master/docs/hooks.md)
// in the `virtual-dom` library called "hooks". When virtual nodes have
// properties that reference hook instances, `virtual-dom` will call `hook`
// and `unhook` on this object with the underlying DOM node when it is created
// and destroyed.
//
// We maintain a global stack of simple `Object` instances in which to store
// references. When creating or updating a component, we push its associated
// `refs` object to the top of the stack. This allows the hooks to assign
// references into the component whose element we are currently creating or
// updating.
export default class RefHook {
  constructor (refName) {
    this.refName = refName
  }

  hook (node) {
    refsStack[refsStack.length - 1][this.refName] = node
  }

  unhook (node) {
    const currentRefs = refsStack[refsStack.length - 1]
    if (refsStack.length > 0 && currentRefs[this.refName] === node) {
      delete currentRefs[this.refName]
    }
  }
}
