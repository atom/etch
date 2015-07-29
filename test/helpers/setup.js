import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {setScheduler} from '../../src/scheduler-assignment';
import TestScheduler from './test-scheduler';

require("babelify/polyfill");

global.chai = chai;
global.sinon = sinon;
global.chai.use(sinonChai);
global.expect = global.chai.expect;

beforeEach(function() {
  this.sandbox = global.sinon.sandbox.create();
  global.stub = this.sandbox.stub.bind(this.sandbox);
  global.spy  = this.sandbox.spy.bind(this.sandbox);
  global.scheduler = new TestScheduler();
  setScheduler(global.scheduler);
});

afterEach(function() {
  delete global.stub;
  delete global.spy;
  delete global.scheduler;
  this.sandbox.restore();
  setScheduler(null);
});
