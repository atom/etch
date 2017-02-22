/** @jsx dom */

const {assert} = require('chai')

const dom = require('../../src/dom')
const render = require('../../src/render')

describe('render (virtualNode)', () => {
  it('constructs DOM nodes from virtual DOM trees', function () {
    const domNode = render(
      <div class='foo'>
        <div class='bar' />
        Hello World
        <span class='baz' />
      </div>
    )

    assert.equal(domNode.outerHTML, `
      <div class="foo">
        <div class="bar"></div>
        Hello World
        <span class="baz"></span>
      </div>
    `.replace(/\n\s*/g, ''))
  })

  it('constructs child components and embeds whatever DOM node is assigned to the `.element` property on the component', function () {
    class Component {
      constructor (props, children) {
        this.element = render(
          <span class={props.class}>
            {children}
          </span>
        )
      }
    }

    const domNode = render(
      <div class='foo'>
        <Component class='bar'>
          <div class='grandchild1' />
          <div class='grandchild2' />
        </Component>
      </div>
    )

    assert.equal(domNode.outerHTML, `
      <div class="foo">
        <span class="bar">
          <div class="grandchild1"></div>
          <div class="grandchild2"></div>
        </span>
      </div>
    `.replace(/\n\s*/g, ''))
  })

  it('passes an empty props object to child components by default', function () {
    class Component {
      constructor (props, children) {
        this.element = document.createElement('div')
        assert.deepEqual(props, {})
        assert.deepEqual(children, [])
      }
    }

    const domNode = render(<div><Component /></div>)
    assert.equal(domNode.outerHTML, `<div><div></div></div>`)
  })
})
