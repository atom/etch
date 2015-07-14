let scheduler = null;

export function setScheduler(customScheduler) {
  if (customScheduler) {
    scheduler = customScheduler;
  } else {
    scheduler = new DefaultScheduler();
  }
}

export function getScheduler() {
  return scheduler;
}

class DefaultScheduler {
  constructor() {
    this.updateRequests = [];
    this.frameRequested = false;
    this.performUpdates = this.performUpdates.bind(this);
  }

  updateDocument(fn) {
    this.updateRequests.push(fn);
    if (!this.frameRequested) {
      this.frameRequested = true;
      window.requestAnimationFrame(this.performUpdates);
    }
  }

  performUpdates() {
    this.frameRequested = false;
    let updateRequest;
    while (updateRequest = this.updateRequests.shift()) {
      updateRequest();
    }
  }
}
