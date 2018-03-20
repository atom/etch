/** @jsx etch.dom */

const etch = require('../../lib/index')

describe('function refs', () => {
  it('work', async function () {
    let saved_node
    let component = {
      render () {
        return <div ref={ node => saved_node = node }>some text</div>
      },

      update () {}
    }

    etch.initialize(component)

    expect(saved_node).to.exist
    expect(saved_node.textContent).to.equal('some text')
  })

  it('allow updating', async function () {
    let saved_nodes = []
    const refFunc = num => node => saved_nodes[num] = node
    let component = {
      render () {
        return (<div>
          <div ref={refFunc(testNumber)}>Testing</div>
        </div>)
      },

      update () {}
    }

    let testNumber = 0

    etch.initialize(component)

    expect(saved_nodes[0].textContent).to.equal('Testing')
    expect(saved_nodes[1]).to.be.undefined

    testNumber = 1

    await etch.update(component)

    expect(saved_nodes[0]).to.be.null
    expect(saved_nodes[1].textContent).to.equal('Testing')
  })

  it('allow switching from text to function and back', async function () {
    let saved_node
    const refFunc = [
      'savedNode',
      node => saved_node = node
    ]
    let component = {
      render () {
        return (<div>
          <div ref={refFunc[testNumber]}>Testing</div>
        </div>)
      },

      update () {}
    }

    let testNumber = 0

    etch.initialize(component)

    expect(component.refs.savedNode.textContent).to.equal('Testing')
    expect(saved_node).to.be.undefined

    testNumber = 1

    await etch.update(component)

    expect(saved_node.textContent).to.equal('Testing')
    expect(component.refs.savedNode).to.be.undefined

    testNumber = 0

    await etch.update(component)

    expect(component.refs.savedNode.textContent).to.equal('Testing')
    expect(saved_node).to.be.null
  })

  it('are removed correctly', async function () {
    let saved_nodes = {}
    let refFunc = name => node => saved_nodes[name] = node
    let component = {
      render () {
        return (<div>
          {testNumber <= 2 ? <div ref={refFunc('div')}>Testing {testNumber}</div> : null}
          {testNumber <= 1 ? <span ref={refFunc('span')}>Testing {testNumber}</span> : null}
          {testNumber <= 0 ?<p ref={refFunc('p')}>Testing {testNumber}</p> : null}
        </div>)
      },

      update () {}
    }

    process.throwThis = true

    let testNumber = 0

    etch.initialize(component)

    expect(saved_nodes.div.textContent).to.equal('Testing 0')
    expect(saved_nodes.span.textContent).to.equal('Testing 0')
    expect(saved_nodes.p.textContent).to.equal('Testing 0')

    testNumber = 1

    await etch.update(component)

    expect(saved_nodes.div.textContent).to.equal('Testing 1')
    expect(saved_nodes.span.textContent).to.equal('Testing 1')
    expect(saved_nodes.p).to.be.null

    testNumber = 2

    await etch.update(component)

    expect(saved_nodes.div.textContent).to.equal('Testing 2')
    expect(saved_nodes.span).to.be.null
    expect(saved_nodes.p).to.be.null

    testNumber = 3

    await etch.update(component)

    expect(saved_nodes.div).to.be.null
    expect(saved_nodes.span).to.be.null
    expect(saved_nodes.p).to.be.null

    process.throwThis = false
  })

  describe('work similarly for components', () => {
    class Component {
      constructor(props, children) {
        this.props = props
        this.children = children
        etch.initialize(this)
      }
      update(props, children) {
        this.props = props
        this.children = children
        return etch.update(this)
      }
      render() {
        return etch.dom('div', {}, this.children)
      }
      destroy() {
        return etch.destroy(this)
      }
    }
    it('work', async function () {
      let saved_node
      let component = {
        render () {
          return <Component ref={ node => saved_node = node }>some text</Component>
        },

        update () {}
      }

      etch.initialize(component)

      expect(saved_node).to.exist
      expect(saved_node.element.textContent).to.equal('some text')
    })

    it('allow updating', async function () {
      let saved_nodes = []
      const refFunc = num => node => saved_nodes[num] = node
      let component = {
        render () {
          return (<div>
            <Component ref={refFunc(testNumber)}>Testing</Component>
          </div>)
        },

        update () {}
      }

      let testNumber = 0

      etch.initialize(component)

      expect(saved_nodes[0].element.textContent).to.equal('Testing')
      expect(saved_nodes[1]).to.be.undefined

      testNumber = 1

      await etch.update(component)

      expect(saved_nodes[0]).to.be.null
      expect(saved_nodes[1].element.textContent).to.equal('Testing')
    })

    it('allow switching from text to function and back', async function () {
      let saved_node
      const refFunc = [
        'savedNode',
        node => saved_node = node
      ]
      let component = {
        render () {
          return (<div>
            <Component ref={refFunc[testNumber]}>Testing</Component>
          </div>)
        },

        update () {}
      }

      let testNumber = 0

      etch.initialize(component)

      expect(component.refs.savedNode.element.textContent).to.equal('Testing')
      expect(saved_node).to.be.undefined

      testNumber = 1

      await etch.update(component)

      expect(saved_node.element.textContent).to.equal('Testing')
      expect(component.refs.savedNode).to.be.undefined

      testNumber = 0

      await etch.update(component)

      expect(component.refs.savedNode.element.textContent).to.equal('Testing')
      expect(saved_node).to.be.null
    })

    it('are removed correctly', async function () {
      let saved_nodes = {}
      let refFunc = name => node => saved_nodes[name] = node
      let component = {
        render () {
          return (<div>
            {testNumber <= 2 ? <Component ref={refFunc('Component')}>Testing {testNumber}</Component> : null}
            {testNumber <= 1 ? <span ref={refFunc('span')}>Testing {testNumber}</span> : null}
            {testNumber <= 0 ?<p ref={refFunc('p')}>Testing {testNumber}</p> : null}
          </div>)
        },

        update () {}
      }

      process.throwThis = true

      let testNumber = 0

      etch.initialize(component)

      expect(saved_nodes.Component.element.textContent).to.equal('Testing 0')
      expect(saved_nodes.span.textContent).to.equal('Testing 0')
      expect(saved_nodes.p.textContent).to.equal('Testing 0')

      testNumber = 1

      await etch.update(component)

      expect(saved_nodes.Component.element.textContent).to.equal('Testing 1')
      expect(saved_nodes.span.textContent).to.equal('Testing 1')
      expect(saved_nodes.p).to.be.null

      testNumber = 2

      await etch.update(component)

      expect(saved_nodes.Component.element.textContent).to.equal('Testing 2')
      expect(saved_nodes.span).to.be.null
      expect(saved_nodes.p).to.be.null

      testNumber = 3

      await etch.update(component)

      expect(saved_nodes.Component).to.be.null
      expect(saved_nodes.span).to.be.null
      expect(saved_nodes.p).to.be.null

      process.throwThis = false
    })
  })
})
