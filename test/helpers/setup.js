/* global beforeEach, afterEach */

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import {setScheduler} from '../../src/scheduler-assignment'
import TestScheduler from './test-scheduler'

chai.use(sinonChai)
global.expect = chai.expect

beforeEach(function () {
  this.sandbox = sinon.sandbox.create()
  setScheduler(new TestScheduler())
})

afterEach(function () {
  this.sandbox.restore()
  setScheduler(null)
})
