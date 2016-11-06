/** @jsx etch.dom */

import etch from '../../src/index'

describe('etch.updateSync(component)', () => {
  it('performs an update of the component\'s element and any resulting child updates synchronously', () => {
    class ParentComponent {
      constructor () {
        this.greeting = 'Hello'
        this.greeted = 'World'
        etch.initialize(this)
      }

      render () {
        return (
          <div>
            <ChildComponent greeting={this.greeting} /> <span>{this.greeted}</span>
          </div>
        )
      }

      update () {}
    }

    class ChildComponent {
      constructor ({greeting}) {
        this.greeting = greeting
        etch.initialize(this)
      }

      render () {
        return <span>{this.greeting}</span>
      }

      update ({greeting}) {
        this.greeting = greeting
        etch.update(this)
      }
    }

    let component = new ParentComponent()
    expect(component.element.textContent).to.equal('Hello World')
    component.greeting = 'Goodnight'
    component.greeted = 'Moon'
    etch.updateSync(component)
    expect(component.element.textContent).to.equal('Goodnight Moon')
  })

  it('calls writeAfterUpdate and readAfterUpdate hooks at the appropriate times', async () => {
    let events = []

    class ParentComponent {
      constructor () {
        etch.initialize(this)
      }

      render () {
        return (
          <div>
            <ChildComponent />
          </div>
        )
      }

      update () {
        etch.update(this)
      }

      writeAfterUpdate () {
        events.push('parent-write')
      }

      readAfterUpdate () {
        events.push('parent-read')
      }
    }

    class ChildComponent {
      constructor () {
        etch.initialize(this)
      }

      render () {
        return <div />
      }

      update () {
        etch.update(this)
      }

      writeAfterUpdate () {
        events.push('child-write')
      }

      readAfterUpdate () {
        events.push('child-read')
      }
    }

    let parent = new ParentComponent()
    expect(events).to.eql([])

    etch.updateSync(parent)

    expect(events).to.eql(['child-write', 'parent-write'])

    // reads are deferred until the next frame to avoid DOM thrash
    await new Promise(requestAnimationFrame)

    expect(events).to.eql(['child-write', 'parent-write', 'child-read', 'parent-read'])
  })

  it('relays updates to non-etch child components', function () {
    class ParentComponent {
      constructor ({greeting}) {
        this.greeting = greeting
        etch.initialize(this)
      }

      render () {
        return (
          <div>
            <ChildComponent greeting={this.greeting} />
          </div>
        )
      }

      update ({greeting}) {
        this.greeting = greeting
        etch.updateSync(this)
      }
    }

    class ChildComponent {
      constructor ({greeting}) {
        this.element = document.createElement('div')
        this.element.textContent = greeting
      }

      update ({greeting}) {
        this.element.textContent = greeting
      }
    }

    let component = new ParentComponent({greeting: 'Hello'})
    expect(component.element.textContent).to.equal('Hello')

    component.update({greeting: 'Goodbye'})
    expect(component.element.textContent).to.equal('Goodbye')
  })

  it('allows non-etch child components to change their element during updates', function () {
    class ParentComponent {
      constructor ({childNodeType}) {
        this.childNodeType = childNodeType
        etch.initialize(this)
      }

      render () {
        return (
          <div>
            <ChildComponent nodeType={this.childNodeType} />
          </div>
        )
      }

      update ({childNodeType}) {
        this.childNodeType = childNodeType
        etch.updateSync(this)
      }
    }

    class ChildComponent {
      constructor ({nodeType}) {
        this.element = document.createElement(nodeType)
      }

      update ({nodeType}) {
        this.element = document.createElement(nodeType)
      }
    }

    let component = new ParentComponent({childNodeType: 'div'})
    expect(component.element.firstChild.tagName).to.equal('DIV')

    component.update({childNodeType: 'span'})
    expect(component.element.firstChild.tagName).to.equal('SPAN')
  })

  it('throws a generic exception if undefined is returned from render in a component that is not a class instance', () => {
    let renderItem = true
    let component = {
      render () {
        return renderItem && <div />
      },

      update () {}
    }

    etch.initialize(component)
    renderItem = false
    expect(function () {
      etch.updateSync(component)
    }).to.throw(/invalid falsy value/)
  })

  it('throws a class-specific exception if undefined is returned from render in a component that is a class instance', () => {
    let renderItem = true
    class MyComponent {
      render () {
        return renderItem && <div />
      }

      update () {}
    }

    let component = new MyComponent()
    etch.initialize(component)
    renderItem = false
    expect(function () {
      etch.updateSync(component)
    }).to.throw(/invalid falsy value.*in MyComponent/)
  })

  it('calls destroy on a replaced component', () => {
    let updated = false
    let destroyed = false
    class ComponentA {
      constructor () {
        etch.initialize(this)
      }

      update () {}

      render () { return <div>A</div> }

      destroy () {
        destroyed = true
        etch.destroy(this)
      }
    }

    class ComponentB {
      constructor () {
        etch.initialize(this)
      }

      update () {}

      render () { return <div>B</div> }
    }

    let component = {
      render () {
        if (updated) { return <ComponentB /> } else { return <ComponentA /> }
      },

      update () {}
    }

    etch.initialize(component)
    expect(component.element.textContent).to.equal('A')
    expect(destroyed).to.equal(false)
    updated = true
    etch.updateSync(component)
    expect(component.element.textContent).to.equal('B')
    expect(destroyed).to.equal(true)
  })
})
