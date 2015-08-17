import render from 'virtual-dom/create-element'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import dom from './dom'
import createElement from './create-element'
import updateElement from './update-element'
import updateElementSync from './update-element-sync'
import {setScheduler, getScheduler} from './scheduler-assignment'

let etch = {
  createElement, updateElement, updateElementSync,
  dom, render, diff, patch,
  setScheduler, getScheduler
}

export default etch
