/** @jsx etch.dom */

import etch from '../../src/index'

describe('etch.update(component)', () => {
  it('schedules an update of the element associated with the component', async () => {
    let component = {
      greeting: 'Hello',

      render () {
        return <div>{this.greeting} World</div>
      }
    }

    let element = etch.initialize(component)
    expect(element.textContent).to.equal('Hello World')

    component.greeting = 'Goodbye'

    await etch.update(component)

    expect(element.textContent).to.equal('Goodbye World')
  })

  it('updates individual compontents no more than once in a given update cycle', async () => {
    let componentA = {
      renderCount: 0,

      render () {
        this.renderCount++
        return <div></div>
      }
    }

    let componentB = {
      renderCount: 0,

      render () {
        this.renderCount++
        return <div></div>
      }
    }

    etch.initialize(componentA)
    etch.initialize(componentB)

    etch.update(componentA)
    etch.update(componentB)
    etch.update(componentA)
    await etch.update(componentB)

    expect(componentA.renderCount).to.equal(2)
    expect(componentB.renderCount).to.equal(2)
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
    etch.initialize(component)

    expect(component.refs.greeting.textContent).to.equal('Hello')
    expect(component.refs.greeted).to.be.undefined

    component.condition = false
    await etch.update(component)

    expect(component.refs.greeted.textContent).to.equal('World')
    expect(component.refs.greeting).to.be.undefined
  })

  it('throws when attempting to change the top-level node type', () => {
    class Component {
      constructor () {
        this.renderDiv = true
        etch.initialize(this)
      }

      render () {
        if (this.renderDiv) {
          return <div />
        } else {
          return <span />
        }
      }
    }

    let component = new Component()
    component.renderDiv = false

    expect(() => {
      etch.updateSync(component)
    }).to.throw(/root DOM node type/)
  })
})
