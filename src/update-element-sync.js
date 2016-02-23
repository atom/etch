import {getScheduler} from './scheduler-assignment'
import performElementUpdate from './perform-element-update'
import componentsWithPendingUpdates from './components-with-pending-updates'

export default function updateElementSync (component) {
  let performUpdate = !componentsWithPendingUpdates.has(component)
  getScheduler().updateDocumentSync(function () {
    if (performUpdate) performElementUpdate(component)
  })
}
