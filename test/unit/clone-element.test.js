/** @jsx etch.dom */

import etch from '../..'
import cloneElement from '../../src/clone-element'

describe('cloneElement', () => {
  it('clones HTML elements, adding properties and children to them', async () => {
    const component = {
      render () {
        const el = <div id='one'><span>Hello</span></div>
        return cloneElement(el, {id: 'two', className: 'fancy'}, <span>Goodbye</span>)
      },

      update () {}
    }

    etch.initialize(component)
    expect(component.element.textContent).to.equal('Goodbye')
    expect(component.element.id).to.equal('two')
    expect([...component.element.classList]).to.eql(['fancy'])
  })

  it('maintains key and ref properties', async () => {
    const el = <div key='one' ref='one'/>
    const newEl = cloneElement(el, {key: 'two', ref: 'two'})
    const component = {
      render () {
        return newEl
      },

      update () {}
    }

    etch.initialize(component)
    expect(component.refs.one).to.be.ok
    expect(component.refs.two).not.to.be.ok
    expect(newEl.key).to.equal('one')
  })

  it('maintains existing children when none new specified', async () => {
    const el = <div>Hello!</div>
    const newEl = cloneElement(el, {className: 'fancy'})
    const component = {
      render () {
        return newEl
      },

      update () {}
    }

    etch.initialize(component)
    expect(component.element.textContent).to.equal('Hello!')
  })

  it('works with custom components', async () => {
    let constructorCalled = false
    class MyComponent {
      constructor (props, children) {
        constructorCalled = true
        this.props = props
        this.children = children
        etch.initialize(this)
      }
      update () {}
      render () { return <span {...this.props}>{this.children} World!</span>}
    }

    const el = <MyComponent>Hi</MyComponent>
    const newEl = cloneElement(el, {className: 'fancy'}, 'Hello')
    const component = {
      render () {
        return newEl
      },

      update () {}
    }

    etch.initialize(component)
    expect(constructorCalled).to.equal(true)
    expect(component.element.textContent).to.equal('Hello World!')
    expect([...component.element.classList]).to.eql(['fancy'])
  })
})
