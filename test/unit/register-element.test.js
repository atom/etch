/* global describe, it, expect */
/** @jsx etch.dom */

import etch from '../../src/index'
import getSetImmediatePromise from '../helpers/get-set-immediate-promise'

describe('etch.registerElement', () => {
  it('renders content when the element is attached, clears content when the element is detached, and calls lifecycle hooks', async () => {
    let TestElement = etch.registerElement('test-element', {
      render () {
        return (
          <test-element>
            <div className='greeting'>Hello</div> <div className='greeted'>World</div>
          </test-element>
        )
      },

      createdCount: 0,
      attachedCount: 0,
      detachedCount: 0,

      createdCallback () {
        this.createdCount++
      },

      attachedCallback () {
        this.attachedCount++
        expect(this.textContent).to.equal('Hello World')
      },

      detachedCallback () {
        this.detachedCount++
        expect(this.textContent).to.equal('Hello World')
      }
    })

    let element = document.createElement('test-element')
    expect(element.textContent).to.equal('')
    expect(element.createdCount).to.equal(1)
    expect(element.attachedCount).to.equal(0)
    expect(element.detachedCount).to.equal(0)

    document.body.appendChild(element)
    expect(element.textContent).to.equal('Hello World')
    expect(element.createdCount).to.equal(1)
    expect(element.attachedCount).to.equal(1)
    expect(element.detachedCount).to.equal(0)

    element.remove()
    expect(element.textContent).to.equal('Hello World')
    expect(element.createdCount).to.equal(1)
    expect(element.attachedCount).to.equal(1)
    expect(element.detachedCount).to.equal(1)

    document.body.appendChild(element)
    await getSetImmediatePromise()

    expect(element.textContent).to.equal('Hello World')
    expect(element.createdCount).to.equal(1)
    expect(element.attachedCount).to.equal(2)
    expect(element.detachedCount).to.equal(1)

    element.remove()
    await getSetImmediatePromise()

    expect(element.textContent).to.equal('')
    expect(element.createdCount).to.equal(1)
    expect(element.attachedCount).to.equal(2)
    expect(element.detachedCount).to.equal(2)

    TestElement.unregister()
  });

  it('schedules a content update when .update() is called on the element', async () => {
    let scheduler = etch.getScheduler()

    let TestElement = etch.registerElement('test-element', {
      render () {
        this.renderCount++
        return (
          <test-element>
            <div className='greeting'>{this.greeting}</div> <div className='greeted'>World</div>
          </test-element>
        )
      },

      renderCount: 0,

      greeting: 'Hello'
    })

    let element = document.createElement('test-element')
    document.body.appendChild(element)

    expect(element.textContent).to.equal('Hello World')
    expect(element.renderCount).to.equal(1)

    element.greeting = 'Goodbye'
    element.update()
    element.update()
    expect(element.textContent).to.equal('Hello World')
    expect(element.renderCount).to.equal(1)

    await scheduler.getNextUpdatePromise()

    expect(element.textContent).to.equal('Goodbye World')
    expect(element.renderCount).to.equal(2)

    TestElement.unregister()
  });

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

    TestElement.unregister()

    // attaching without a render method should not be problematic if
    // the element is unregistered
    document.body.appendChild(element2)
  });
});
