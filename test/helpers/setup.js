/* global beforeEach, afterEach */

import chai from 'chai'

import {setScheduler} from '../../src/scheduler-assignment'
import TestScheduler from './test-scheduler'

global.expect = chai.expect

beforeEach(function () {
  document.body.innerHTML = ''
  setScheduler(new TestScheduler())
})

afterEach(function () {
  setScheduler(null)
})
