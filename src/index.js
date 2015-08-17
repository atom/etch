import render from 'virtual-dom/create-element'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import dom from './dom'
import createElement from './create-element'
import updateElement from './update-element'
import {setScheduler, getScheduler} from './scheduler-assignment'

let etch = {
  createElement, updateElement,
  dom, render, diff, patch,
  setScheduler, getScheduler
}

export default etch
