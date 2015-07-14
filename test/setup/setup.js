import {jsdom} from 'jsdom';
import {setScheduler} from '../../src/scheduler-assignment';
import TestScheduler from './test-scheduler';

global.document = jsdom();

module.exports = function() {
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
};
