/** @jsx etch.dom */

const etch = require('../../lib/index')

describe('etch.initialize(component)', () => {
  it('returns an element with content based on the render method of the given component', () => {
    let component = {
      render () {
        return <div>Hello World</div>
      },

      update () {}
    }
    etch.initialize(component)

    expect(component.element.textContent).to.equal('Hello World')
  })

  it('creates references to DOM elements', () => {
    let component = {
      render () {
        return <div><span ref='greeting'>Hello</span> <span ref='greeted'>World</span></div>
      },

      update () {}
    }
    etch.initialize(component)

    expect(component.refs.greeting.textContent).to.equal('Hello')
    expect(component.refs.greeted.textContent).to.equal('World')
  })

  it('updates references to DOM elements', async () => {
    let componentIndexWithRef = 1
    let component = {
      render () {
        let firstElementProperties = componentIndexWithRef === 0 ? {ref: 'selected'} : {}
        let secondElementProperties = componentIndexWithRef === 1 ? {ref: 'selected'} : {}
        return (
          <ul>
            <li {...firstElementProperties}>one</li>
            <li {...secondElementProperties}>two</li>
          </ul>
        )
      },

      update () {}
    }
    etch.initialize(component)
    expect(component.refs.selected.textContent).to.equal('two')

    componentIndexWithRef = 0
    await etch.update(component)
    expect(component.refs.selected.textContent).to.equal('one')
  })

  it('nests references correctly', async () => {
    class Component {
      constructor(props, children) {
        this.children = children
        etch.initialize(this)
      }

      update() {}

      render () {
        return <div>{this.children}</div>
      }
    }

    class TestHarness {
      constructor() {
        etch.initialize(this)
      }

      update() {}

      render() {
        return (
          <Component ref="outer">
            <Component ref="middle">
              <div ref="inner" />
            </Component>
          </Component>
        )
      }
    }

    const harness = new TestHarness()
    expect(harness.refs.outer).to.be.ok
    expect(harness.refs.middle).to.be.ok
    expect(harness.refs.inner).to.be.ok
    expect(harness.refs.outer.refs.middle).to.be.undefined
  })

  it('throws an exception if undefined is returned from render', () => {
    let component = {
      render () {},

      update () {}
    }

    expect(function () {
      etch.initialize(component)
    }).to.throw(/invalid falsy value/)
  })
})
