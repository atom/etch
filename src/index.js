import dom from './dom'
import render from './render'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import observe from 'data-observer'
import {setScheduler, getScheduler} from './scheduler-assignment'
import defineElement from './define-element'

let etch = {
  defineElement, observe,
  dom, render, diff, patch,
  setScheduler, getScheduler
}

export default etch
