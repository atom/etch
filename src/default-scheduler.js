// If the scheduler is not customized via `etch.setScheduler`, an instance of
// this class will be used to schedule updates to the document. The
// `updateDocument` method accepts functions to be run at some point in the
// future, then runs them on the next animation frame.
export default class DefaultScheduler {
  constructor () {
    this.updateRequests = []
    this.pendingAnimationFrame = null
    this.performUpdates = this.performUpdates.bind(this)
  }

  updateDocument (fn) {
    this.updateRequests.push(fn)
    if (!this.pendingAnimationFrame) {
      this.pendingAnimationFrame = window.requestAnimationFrame(this.performUpdates)
    }
  }

  updateDocumentSync (fn) {
    if (this.pendingAnimationFrame) window.cancelAnimationFrame(this.pendingAnimationFrame)
    this.updateRequests.push(fn)
    this.performUpdates()
  }

  getNextUpdatePromise () {
    if (!this.nextUpdatePromise) {
      this.nextUpdatePromise = new Promise(resolve => {
        this.resolveNextUpdatePromise = resolve
      })
    }
    return this.nextUpdatePromise
  }

  performUpdates () {
    while (this.updateRequests.length > 0) {
      this.updateRequests.shift()()
    }
    this.pendingAnimationFrame = null
    if (this.nextUpdatePromise) {
      let resolveNextUpdatePromise = this.resolveNextUpdatePromise
      this.nextUpdatePromise = null
      this.resolveNextUpdatePromise = null
      resolveNextUpdatePromise()
    }
  }
}
