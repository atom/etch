/** @jsx etch.dom */

import etch from '../../src/index'

describe('etch.updateElement(component)', () => {
  it('schedules an update of the element associated with the component', async () => {
    let component = {
      greeting: 'Hello',

      render () {
        return <div>{this.greeting} World</div>
      }
    }

    let element = etch.createElement(component)
    expect(element.textContent).to.equal('Hello World')

    component.greeting = 'Goodbye'

    await etch.updateElement(component)

    expect(element.textContent).to.equal('Goodbye World')
  })

  it('updates references to DOM elements', async () => {
    let component = {
      condition: true,

      render () {
        if (this.condition) {
          return <div><span ref='greeting'>Hello</span></div>
        } else {
          return <div><span ref='greeted'>World</span></div>
        }
      }
    }
    etch.createElement(component)

    expect(component.refs.greeting.textContent).to.equal('Hello')
    expect(component.refs.greeted).to.be.undefined

    component.condition = false
    await etch.updateElement(component)

    expect(component.refs.greeted.textContent).to.equal('World')
    expect(component.refs.greeting).to.be.undefined
  })

  it('calls destroy() on removed components', async () => {
    let childDestroyedOrder = 0
    let greatGrandchildDestroyedOrder = 0
    let destroyedCount = 0

    class ParentComponent {
      constructor () {
        this.renderChild = true
        etch.createElement(this)
      }

      render () {
        if (this.renderChild) {
          // test handles destroying components rendered via `children`
          return <div><ChildComponent><GrandchildComponent /></ChildComponent></div>
        } else {
          return <div />
        }
      }
    }

    class ChildComponent {
      constructor (props, children) {
        this.children = children
        etch.createElement(this)
      }

      render () {
        return <div>{this.children}</div>
      }

      destroy () {
        childDestroyedOrder = ++destroyedCount
      }
    }

    class GrandchildComponent {
      constructor () {
        etch.createElement(this)
      }

      render () {
        // test handles destroying components that are
        // eventual children of plain DOM components
        return <div><span><GreatGrandchildComponent /></span></div>
      }
    }

    class GreatGrandchildComponent {
      constructor () {
        etch.createElement(this)
      }

      render () {
        return <div />
      }

      destroy () {
        greatGrandchildDestroyedOrder = ++destroyedCount
      }
    }

    let component = new ParentComponent()
    component.renderChild = false
    await etch.updateElement(component)

    expect(childDestroyedOrder).to.equal(2)
    expect(greatGrandchildDestroyedOrder).to.equal(1)
  })
})
