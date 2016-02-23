import {getScheduler} from './scheduler-assignment'
import performElementUpdate from './perform-element-update'

let componentsWithPendingUpdates = new WeakSet

export default function updateElement (component) {
  let scheduler = getScheduler()

  if (!componentsWithPendingUpdates.has(component)) {
    componentsWithPendingUpdates.add(component)
    scheduler.updateDocument(function () {
      componentsWithPendingUpdates.delete(component)
      performElementUpdate(component)
    })
  }

  return scheduler.getNextUpdatePromise()
}
