import dom from './dom'
import {initialize, update, updateSync, destroy, destroySync, stateless} from './component-helpers'
import {setScheduler, getScheduler} from './scheduler-assignment'

let etch = {
  dom,
  initialize, update, updateSync, destroy, destroySync, stateless,
  setScheduler, getScheduler
}

export default etch
