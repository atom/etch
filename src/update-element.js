import updateElementSync from './update-element-sync'
import {getScheduler} from './scheduler-assignment'

export default function updateElement (component) {
  getScheduler().updateDocument(function () {
    updateElementSync(component)
  })
}
