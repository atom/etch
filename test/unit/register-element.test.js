/* global describe, it, expect */

import etch from '../../src/index'

describe('etch.registerElement', () => {
  it('allows registered elements to be unregistered', () => {
    let TestElement = etch.registerElement('test-element', {
      foo: 'bar'
    })

    let element1 = document.createElement('test-element')
    expect(element1.foo).to.equal('bar')

    TestElement.unregister()

    TestElement = etch.registerElement('test-element', {
      baz: 'qux'
    })

    let element2 = document.createElement('test-element')
    expect(element2.foo).to.be.undefined
    expect(element2.baz).to.equal('qux')
  });
});
