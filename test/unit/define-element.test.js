/** @jsx etch.dom */

import etch from '../../src/index'
import getSetImmediatePromise from '../helpers/get-set-immediate-promise'

describe('etch.defineElement', () => {
  it('defines an anonymous element that renders content when the element is attached, clears content when the element is detached, and calls lifecycle hooks', async () => {
    let TestElement = etch.defineElement('div', {
      render () {
        return (
          <div>
            <div className='greeting'>Hello</div> <div className='greeted'>World</div>
          </div>
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

    let element = TestElement()

    expect(element instanceof TestElement).to.be.true
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
  });

  it('wires references to DOM nodes with ref attributes', () => {
    let TestElement = etch.defineElement('div', {
      render () {
        return (
          <div>
            <div ref='greeting'>Hello</div> <div ref='greeted'>World</div>
          </div>
        )
      }
    })

    let element = TestElement()
    document.body.appendChild(element)
    expect(element.textContent).to.equal('Hello World')
    expect(element.refs.greeting.textContent).to.equal('Hello')
    expect(element.refs.greeted.textContent).to.equal('World')
  });

  it('schedules a content update when .update() is called on the element', async () => {
    let scheduler = etch.getScheduler()

    let TestElement = etch.defineElement('div', {
      render () {
        this.renderCount++
        return (
          <div>
            <div className='greeting'>{this.greeting}</div> <div className='greeted'>World</div>
          </div>
        )
      },

      renderCount: 0,

      greeting: 'Hello'
    })

    let element = TestElement()
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
  });
});
