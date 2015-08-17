import {getScheduler} from './scheduler-assignment'
import performElementUpdate from './perform-element-update'

export default function updateElement (component) {
  getScheduler().updateDocument(function () {
    performElementUpdate(component)
  })
}
