/* global describe, it, expect */
/** @jsx etch.dom */

import etch from '../../src/index'
import getSetImmediatePromise from '../helpers/get-set-immediate-promise'

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

  it('patches in content when the element is attached, and clears content when the element is detached without being reattached in the same tick', async () => {
    let TestElement = etch.registerElement('test-element', {
      render () {
        return (
          <test-element>
            <div className='greeting'>Hello</div> <div className='greeted'>World</div>
          </test-element>
        )
      }
    })

    let element = document.createElement('test-element')
    expect(element.textContent).to.equal('')

    document.body.appendChild(element)
    expect(element.textContent).to.equal('Hello World')

    element.remove()
    expect(element.textContent).to.equal('Hello World')
    document.body.appendChild(element)

    await getSetImmediatePromise()

    expect(element.textContent).to.equal('Hello World')

    element.remove()

    await getSetImmediatePromise()

    expect(element.textContent).to.equal('')
  });
});
