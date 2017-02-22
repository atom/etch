/* global beforeEach */

const chai = require('chai')
global.expect = chai.expect

beforeEach(function () {
  document.body.innerHTML = ''
})
