global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('sinon-chai'));

require('babel/register')({
  optional: ["es7.asyncFunctions"]
});
require('./setup')();
