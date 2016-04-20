import dom from './dom'
import {initialize, update, updateSync, destroy, destroySync, onUpdate} from './component-helpers'
import {setScheduler, getScheduler} from './scheduler-assignment'

let etch = {
  dom,
  initialize, update, updateSync, destroy, destroySync, onUpdate,
  setScheduler, getScheduler
}

export default etch
