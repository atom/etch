import {getScheduler} from './scheduler-assignment'
import performElementUpdate from './perform-element-update'
import componentsWithPendingUpdates from './components-with-pending-updates'

// This function receives a component that has already been associated with an
// element via a previous call to `createElement` and updates this element by
// calling `render` on the component.
//
// It uses the scheduler to defer this update until the next animation frame,
// and will only perform one update of a given component in a given frame. This
// means you can call `updateElement` repeatedly in a given tick without causing
// redundant updates.
//
// Returns a promise that will resolve when the requested update has been
// completed.
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
