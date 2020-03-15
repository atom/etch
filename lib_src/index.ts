const dom = require('./dom')
import {render} from "./render";
import {initialize, update, updateSync, destroy, destroySync} from './component-helpers'
import {setScheduler, getScheduler} from './scheduler-assignment'

module.exports = {
  dom, render,
  initialize, update, updateSync, destroy, destroySync,
  setScheduler, getScheduler
}
