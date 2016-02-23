import dom from './dom'
import {initialize, update, updateSync, destroy, destroySync} from './component-helpers'
import {setScheduler, getScheduler} from './scheduler-assignment'

let etch = {
  dom,
  initialize, update, updateSync, destroy, destroySync,
  setScheduler, getScheduler
}

export default etch
