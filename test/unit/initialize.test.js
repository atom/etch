/** @jsx etch.dom */

import etch from '../../src/index'

describe('etch.initialize(component)', () => {
  it('returns an element with content based on the render method of the given component', () => {
    let component = {
      render () {
        return <div>Hello World</div>
      }
    }
    let element = etch.initialize(component)

    expect(element.textContent).to.equal('Hello World')
    expect(component.element).to.equal(element)
  })

  it('creates references to DOM elements', () => {
    let component = {
      render () {
        return <div><span ref='greeting'>Hello</span> <span ref='greeted'>World</span></div>
      }
    }
    etch.initialize(component)

    expect(component.refs.greeting.textContent).to.equal('Hello')
    expect(component.refs.greeted.textContent).to.equal('World')
  })
})
