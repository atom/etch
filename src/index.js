import dom from './dom'
import {initialize, update, updateSync, destroy, destroySync, onUpdate} from './component-helpers'
import {setScheduler, getScheduler} from './scheduler-assignment'
import {cloneElement} from './clone-element'

let etch = {
  dom,
  initialize, update, updateSync, destroy, destroySync, onUpdate,
  setScheduler, getScheduler,
  cloneElement
}

export default etch
