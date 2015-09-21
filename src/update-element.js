import {getScheduler} from './scheduler-assignment'
import performElementUpdate from './perform-element-update'

export default function updateElement (component) {
  let scheduler = getScheduler()
  scheduler.updateDocument(function () {
    performElementUpdate(component)
  })
  return scheduler.getNextUpdatePromise()
}
