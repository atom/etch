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

  it('throws an exception if undefined is returned from render', () => {
    let component = {
      render () {},

      update () {}
    }

    expect(function () {
      etch.initialize(component)
    }).to.throw(/invalid falsy value/)
  })

  it('allows for multi dimensional refs', async function () {
    let component = {
      render () {
        return <div ref={['divs', 'first']}><div ref={['divs', 'second']}>second</div></div>
      },

      update () {}
    }

    etch.initialize(component)

    expect('divs' in component.refs).to.be.true
    expect(component.refs.divs).to.have.all.keys(['first', 'second'])
    expect(component.refs.divs.second.textContent).to.equal('second')
  })

  it('allows for deep multi dimensional refs', async function () {
    let component = {
      render () {
        return <div ref={['divs', 'test', 'first']}>hello</div>
      },

      update () {}
    }

    etch.initialize(component)

    expect(component.refs.divs.test.first.textContent).to.equal('hello')
  })

  it('allows updating multi dimensional refs', async function () {
    let component = {
      render () {
        return (<div>
          <div ref={['tests', 'num_' + testNumber]}>Testing</div>
        </div>)
      },

      update () {}
    }

    let testNumber = 0

    etch.initialize(component)

    expect(component.refs.tests.num_0.textContent).to.equal('Testing')

    testNumber = 1

    await etch.update(component)

    expect(component.refs.tests.num_1.textContent).to.equal('Testing')
  })

  it('should remove refs in a logical manner', async function () {
    let component = {
      render () {
        return (<div>
          <div ref={['tests', testNumber, 'div']}>Testing</div>
          <span ref={['tests', testNumber, 'span']}>Testing</span>
          <p ref={['tests', 0, 'p']}>Testing</p>
        </div>)
      },

      update () {}
    }

    process.throwThis = true

    let testNumber = 0

    etch.initialize(component)

    expect(component.refs.tests[0].div.textContent).to.equal('Testing')
    expect(component.refs.tests[0].span.textContent).to.equal('Testing')
    expect(component.refs.tests[0].p.textContent).to.equal('Testing')

    expect(Object.keys(component.refs).length).to.equal(1)
    expect(Object.keys(component.refs.tests).length).to.equal(1)

    testNumber = 1

    await etch.update(component)

    expect(component.refs.tests[1].div.textContent).to.equal('Testing')
    expect(component.refs.tests[1].span.textContent).to.equal('Testing')
    expect(component.refs.tests[0].p.textContent).to.equal('Testing')

    expect(Object.keys(component.refs).length).to.equal(1)
    expect(Object.keys(component.refs.tests).length).to.equal(2)

    testNumber = 2

    await etch.update(component)

    expect(component.refs.tests[2].div.textContent).to.equal('Testing')
    expect(component.refs.tests[2].span.textContent).to.equal('Testing')
    expect(component.refs.tests[0].p.textContent).to.equal('Testing')

    expect(Object.keys(component.refs).length).to.equal(1)
    expect(Object.keys(component.refs.tests).length).to.equal(2)

    process.throwThis = false
  })
})
