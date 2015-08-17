import {getScheduler} from './scheduler-assignment'
import performElementUpdate from './perform-element-update'

export default function updateElementSync (component) {
  getScheduler().updateDocumentSync(function () {
    performElementUpdate(component)
  })
}
