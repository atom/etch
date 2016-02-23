import {getScheduler} from './scheduler-assignment'
import performElementUpdate from './perform-element-update'
import componentsWithPendingUpdates from './components-with-pending-updates'

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
