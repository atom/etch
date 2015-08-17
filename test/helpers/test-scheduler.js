export default class TestScheduler {
  constructor () {
    this.updateRequests = []
    this.updateRequested = false
    this.nextUpdatePromise = null
    this.resolveNextUpdatePromise = null
    this.performUpdates = this.performUpdates.bind(this)
  }

  updateDocument (fn) {
    this.updateRequests.push(fn)
    if (!this.updateRequested) {
      this.updateRequested = true
      global.setImmediate(this.performUpdates)
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
