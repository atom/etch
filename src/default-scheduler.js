export default class DefaultScheduler {
  constructor () {
    this.updateRequests = []
    this.updateRequested = false
    this.performUpdates = this.performUpdates.bind(this)
  }

  updateDocument (fn) {
    this.updateRequests.push(fn)
    if (!this.updateRequested) {
      this.updateRequested = true
      window.requestAnimationFrame(this.performUpdates)
    }
  }

  updateDocumentSync (fn) {
    this.updateRequests.push(fn)
    if (!this.updateRequested) {
      this.performUpdates()
    }
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
    this.updateRequested = false
    if (this.nextUpdatePromise) {
      let resolveNextUpdatePromise = this.resolveNextUpdatePromise
      this.nextUpdatePromise = null
      this.resolveNextUpdatePromise = null
      resolveNextUpdatePromise()
    }
  }
}
