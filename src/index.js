import dom from './dom'
import createElement from './create-element'
import updateElement from './update-element'
import updateElementSync from './update-element-sync'
import {setScheduler, getScheduler} from './scheduler-assignment'

let etch = {
  dom,
  createElement, updateElement, updateElementSync,
  setScheduler, getScheduler
}

export default etch
