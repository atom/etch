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

    etch.initialize(component)
    expect(component.element.textContent).to.equal('Hello World')

    component.greeting = 'Goodbye'

    await etch.update(component)

    expect(component.element.textContent).to.equal('Goodbye World')
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

  it('calls the destroy method on removed child components if it is present', async () => {
    let destroyCalls = []

    class ParentComponent {
      constructor () {
        this.renderChildren = true
        etch.initialize(this)
      }

      render () {
        if (this.renderChildren) {
          return (
            <div>
              <ChildComponent ref='child' />
              <ChildComponentWithNoDestroyMethod ref='childWithNoDestroyMethod' />
            </div>
          )
        } else {
          return <div />
        }
      }

      // this method should not be called when we call etch.destroy with this component
      destroy () {
        etch.destroy(this)
        destroyCalls.push(this)
      }
    }

    class ChildComponent {
      constructor () {
        etch.initialize(this)
      }

      render () {
        return <div><GrandchildComponent ref='grandchild' /></div>
      }

      destroy () {
        etch.destroy(this)
        destroyCalls.push(this)
      }
    }

    class GrandchildComponent {
      constructor () {
        etch.initialize(this)
      }

      render () {
        return <div></div>
      }

      destroy () {
        etch.destroy(this)
        destroyCalls.push(this)
      }
    }

    class ChildComponentWithNoDestroyMethod {
      constructor () {
        etch.initialize(this)
      }

      render () {
        return <div></div>
      }
    }

    let parent = new ParentComponent()
    let child = parent.refs.child
    let grandchild = child.refs.grandchild
    let childWithNoDestroyMethod = parent.refs.childWithNoDestroyMethod

    parent.renderChildren = false
    await etch.update(parent)

    expect(destroyCalls).to.eql([grandchild, child])
    expect(parent.element.innerHTML).to.equal('')
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
