import dom from './dom'
import createElement from './create-element'
import {updateElement, updateElementSync} from './update-element'
import {setScheduler, getScheduler} from './scheduler-assignment'

let etch = {
  dom,
  createElement, updateElement, updateElementSync,
  setScheduler, getScheduler
}

export default etch
