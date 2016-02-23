import dom from './dom'
import initialize from './initialize'
import {update, updateSync} from './update'
import {setScheduler, getScheduler} from './scheduler-assignment'

let etch = {
  dom,
  initialize, update, updateSync,
  setScheduler, getScheduler
}

export default etch
