import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import observe from 'data-observer'
import dom from './dom'
import createElement from './create-element'
import { setScheduler, getScheduler } from './scheduler-assignment'
import registerElement from './register-element'

let etch = {registerElement, observe, dom, createElement, setScheduler, diff, patch, getScheduler}

export default etch
