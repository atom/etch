import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import observe from 'data-observer'
import dom from './dom'
import createElement from './create-element'
import {setScheduler, getScheduler} from './scheduler-assignment'
import defineElement from './define-element'

let etch = {
  defineElement, observe,
  dom, createElement, diff, patch,
  setScheduler, getScheduler
}

export default etch
