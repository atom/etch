/** @jsx dom */

const {assert} = require('chai')
const Random = require('random-seed')

const dom = require('../../lib/dom')
const render = require('../../lib/render')
const patch = require('../../lib/patch')

describe('patch (oldVirtualNode, newVirtualNode)', () => {
  describe('properties', function () {
    it('can add, remove, and update properties', function () {
      assertValidPatch(<div a='1' b='2' />, <div b='3' c='4' />)
    })

    it('can update from no properties to some properties and vice versa', function () {
      assertValidPatch(<div />, <div a='1' />)
      assertValidPatch(<div a='1' />, <div />)
    })

    it('correctly updates the `dataset` property', function () {
      assertValidPatch(
        <div />,
        <div dataset={{a: 1, b: 2}} />,
      )
      assertValidPatch(
        <div dataset={{a: 1, b: 2}} />,
        <div dataset={{b: 4, c: 6}} />
      )
    })

    it('correctly updates the `style` property', function () {
      assertValidPatch(
        <div />,
        <div style={{display: 'none', color: 'red'}} />,
      )
      assertValidPatch(
        <div style={{display: 'none', color: 'red'}} />,
        <div style={{color: 'blue', fontFamily: 'monospace'}} />
      )
      assertValidPatch(
        <div style={{display: 'none', color: 'red'}} />,
        <div style="color: 'blue'; fontFamily: 'monospace'" />
      )
      assertValidPatch(
        <div style="color: blue; font-family: monospace;" />,
        <div style={{display: 'none', color: 'red'}} />
      )
    })

    it('correctly updates the `className` property', function () {
      assertValidPatch(
        <div />,
        <div className='a' />,
      )
      assertValidPatch(
        <div className='a' />,
        <div className='b' />
      )

      const oldVirtualNode = <div className='b' />
      const oldNode = render(oldVirtualNode)
      const newVirtualNode = <div />
      const newNode = render(newVirtualNode)
      patch(oldNode, newNode)
      assert(!newNode.className)
    })

    describe('`input.value` property', function () {
      it('conserves the selection when possible', function () {
        const virtualNode1 = <input type='text' value='pig' />
        const element = render(virtualNode1)

        // Assume the user changed the value to `ping` by
        // moving the cursor after the `i` and adding `n`.
        // The new value is now `ping` and the cursor
        // position is after the `n` on index 3
        element.value = 'ping'
        element.selectionStart = 3
        element.selectionEnd = 3

        // Assume that the input is a "controlled" input so
        // it updates the virtual node with the same value
        const virtualNode2 = <input type='text' value='ping' />
        patch(virtualNode1, virtualNode2)

        // the selection should have stayed in the same position
        assert.equal(element.selectionStart, 3)
        assert.equal(element.selectionEnd, 3)
      })

      it('correctly updates the `select.value` property', function () {
        const virtualNode1 = (
          <select value='a'>
            <option value='a' />
            <option value='b' />
          </select>
        )
        const element = render(virtualNode1)

        // Assume the user changed the value to `b`.
        element.value = 'b'

        // Assume that the select is a "controlled" select and
        // the changes have been rejected, so the virtual node
        // remains the same
        const virtualNode2 = (
          <select value='a'>
            <option value='a' />
            <option value='b' />
          </select>
        )
        patch(virtualNode1, virtualNode2)

        // the value should have been reverted
        assert.equal(element.value, 'a')
      })
    })

    it('reverts when change is rejected', function () {
      const virtualNode1 = <input type='text' value='pig' />
      const element = render(virtualNode1)

      // Assume the user changed the value to `ping`.
      element.value = 'ping'

      // Assume that the input is a "controlled" input and
      // the changes have been rejected, so the virtual node
      // remains the same
      const virtualNode2 = <input type='text' value='pig' />
      patch(virtualNode1, virtualNode2)

      // the value should have been reverted
      assert.equal(element.value, 'pig')
    })

    it('allows attributes to be updated via the special `attributes` property', () => {
      const virtualNode1 = <div attributes={{a: 1, b: 2}} />
      const element = render(virtualNode1)
      assert.equal(element.getAttribute('a'), '1')
      assert.equal(element.getAttribute('b'), '2')

      const virtualNode2 = <div attributes={{b: 3, c: 4}} />
      patch(virtualNode1, virtualNode2)
      assert(!element.hasAttribute('a'))
      assert.equal(element.getAttribute('b'), '3')
      assert.equal(element.getAttribute('c'), '4')
    })
  })

  describe('keyed children', function () {
    it('can add and remove children at the end', function () {
      assertValidPatch(
        <div>{keyedSpans('a', 'b')}</div>,
        <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
      )
      assertValidPatch(
        <div>{keyedSpans('a', 'b', 'c', 'd')}</div>,
        <div>{keyedSpans('a', 'b')}</div>
      )
    })

    it('can add and remove children at the beginning', function () {
      assertValidPatch(
        <div>{keyedSpans('c', 'd')}</div>,
        <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
      )
      assertValidPatch(
        <div>{keyedSpans('a', 'b', 'c', 'd')}</div>,
        <div>{keyedSpans('c', 'd')}</div>
      )
    })

    it('can add and remove in the middle of existing children', function () {
      assertValidPatch(
        <div>{keyedSpans('a', 'd')}</div>,
        <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
      )
      assertValidPatch(
        <div>{keyedSpans('a', 'b', 'c', 'd')}</div>,
        <div>{keyedSpans('a', 'd')}</div>
      )
    })

    it('can add and remove children at both ends', function () {
      assertValidPatch(
        <div>{keyedSpans('c', 'd')}</div>,
        <div>{keyedSpans('a', 'b', 'c', 'd', 'e', 'f')}</div>
      )
      assertValidPatch(
        <div>{keyedSpans('a', 'b', 'c', 'd', 'e', 'f')}</div>,
        <div>{keyedSpans('c', 'd')}</div>
      )
    })

    it('can add children to an empty parent and remove all children', function () {
      assertValidPatch(
        <div></div>,
        <div>{keyedSpans('a', 'b')}</div>
      )
      assertValidPatch(
        <div>{keyedSpans('a', 'b')}</div>,
        <div></div>
      )
    })

    it('can move children to the right and left', function () {
      assertValidPatch(
        <div>{keyedSpans('a', 'b', 'c', 'd')}</div>,
        <div>{keyedSpans('b', 'c', 'a', 'd')}</div>
      )
      assertValidPatch(
        <div>{keyedSpans('a', 'b', 'c', 'd')}</div>,
        <div>{keyedSpans('a', 'd', 'b', 'c')}</div>
      )
    })

    it('can move children to the start and end', function () {
      assertValidPatch(
        <div>{keyedSpans('a', 'b', 'c', 'd')}</div>,
        <div>{keyedSpans('a', 'c', 'd', 'b')}</div>
      )
      assertValidPatch(
        <div>{keyedSpans('a', 'b', 'c', 'd')}</div>,
        <div>{keyedSpans('c', 'a', 'b', 'd')}</div>
      )
    })

    it('can swap the first and last child', function () {
      assertValidPatch(
        <div>{keyedSpans('a', 'b', 'c', 'd')}</div>,
        <div>{keyedSpans('d', 'c', 'd', 'a')}</div>
      )
    })

    it('can update to randomized reorderings of children', function () {
      for (let i = 0; i < 20; i++) {
        const seed = Date.now()
        const randomGenerator = Random(seed)
        assertValidPatch(
          <div>{keyedSpans(...randomLetters(randomGenerator))}</div>,
          <div>{keyedSpans(...randomLetters(randomGenerator))}</div>,
          seed
        )
      }
    })

    it('allows arbitrary objects to be used as keys', () => {
      const keyA = {key: 'a'}
      const keyB = {key: 'b'}
      const keyC = {key: 'c'}
      const keyD = {key: 'c'}

      class ChildComponent {
        constructor (props) {
          this.element = document.createElement('div')
          this.element.textContent = props.text
        }

        update (props) {
          this.element.textContent = props.text
        }
      }

      const virtualNode1 = (
        <div>
          <ChildComponent key={keyA} text='a'/>
          <ChildComponent key={keyB} text='b'/>
        </div>
      )
      const element = render(virtualNode1)
      const [elementA, elementB] = element.children

      const virtualNode2 = (
        <div>
          <ChildComponent key={keyB} text='d'/>
          <ChildComponent key={keyD} text='y'/>
          <ChildComponent key={keyA} text='c'/>
          <ChildComponent key={keyC} text='x'/>
        </div>
      )
      patch(virtualNode1, virtualNode2)

      assert.equal(element.children[0], elementB)
      assert.equal(element.children[2], elementA)
      assert.equal(elementA.textContent, 'c')
      assert.equal(elementB.textContent, 'd')
    })
  })

  describe('unkeyed children', function () {
    it('can append nodes', function () {
      assertValidPatch(
        <div><span>Hello</span></div>,
        <div><span>Hello</span><span>World</span></div>
      )
      assertValidPatch(
        <div><span>Hello</span></div>,
        <div><span>Hello</span><div>World</div></div>
      )
    })

    it('can prepend nodes', function () {
      assertValidPatch(
        <div><span>World</span></div>,
        <div><span>Hello</span><span>World</span></div>
      )
      assertValidPatch(
        <div><div>World</div></div>,
        <div><span>Hello</span><div>World</div></div>
      )
    })

    it('can change text children', function () {
      assertValidPatch(
        <div><span>Hello</span><span>World</span></div>,
        <div><span>Goodnight</span><span>Moon</span></div>
      )
    })

    it('can handle text children that are empty', function () {
      assertValidPatch(
        <div><span>Hello</span></div>,
        <div><span>{''}</span></div>
      )
      assertValidPatch(
        <div><span>{''}</span></div>,
        <div><span>Hello</span></div>
      )
    })

    it('can replace a child with a text child and vice versa', function () {
      assertValidPatch(
        <div><span>Hello</span><span>World</span></div>,
        <div>Goodnight<span>World</span></div>
      )
      assertValidPatch(
        <div>Goodnight<span>World</span></div>,
        <div><span>Hello</span><span>World</span></div>
      )
      assertValidPatch(
        <div><span>Hello</span>World</div>,
        <div>Goodnight<span>Moon</span></div>
      )
    })

    it('can update to randomized reorderings of children', function () {
      for (let i = 0; i < 20; i++) {
        const seed = Date.now()
        const randomGenerator = Random(seed)
        assertValidPatch(
          <div>{spans(...randomLetters(randomGenerator))}</div>,
          <div>{spans(...randomLetters(randomGenerator))}</div>,
          seed
        )
      }
    })
  })

  it('can replace a node with a node of a different type', function () {
    const parent = render(<div />)
    const oldVirtualNode = <div>Hello</div>
    const oldNode = render(oldVirtualNode)
    parent.appendChild(oldNode)
    const newNode = patch(oldVirtualNode, <span>Goodbye</span>)
    assert.equal(newNode.outerHTML, '<span>Goodbye</span>')
    assert.deepEqual(Array.from(parent.children), [newNode])
  })

  describe('ref properties', function () {
    it('maintains references to child elements based on their `ref` property', function () {
      const refs = {}

      const virtualNode1 = (
        <div ref='a' class='a'>
          <div ref='b' class='b' />
          <div ref='c' class='c'>
            <div ref='d' class='d' />
          </div>
          <div ref='e' class='e' />
        </div>
      )
      let element1 = render(virtualNode1, {refs})

      assert.equal(refs.a, element1)
      assert.equal(refs.b, element1.querySelector('.b'))
      assert.equal(refs.c, element1.querySelector('.c'))
      assert.equal(refs.d, element1.querySelector('.d'))
      assert.equal(refs.e, element1.querySelector('.e'))

      const virtualNode2 = (
        <div class='a'>
          <div ref='e' class='b' />
          <span ref='f' class='e' />
          <p ref='g' class='g' />
        </div>
      )
      patch(virtualNode1, virtualNode2, {refs})

      assert(!refs.hasOwnProperty('a'))
      assert(!refs.hasOwnProperty('b'))
      assert(!refs.hasOwnProperty('c'))
      assert(!refs.hasOwnProperty('d'))
      assert.equal(refs.e, element1.querySelector('.b'))
      assert.equal(refs.f, element1.querySelector('.e'))
      assert.equal(refs.g, element1.querySelector('.g'))

      const virtualNode3 = <span ref='h' />
      const element2 = patch(virtualNode2, virtualNode3, {refs})
      assert(!refs.hasOwnProperty('e'))
      assert(!refs.hasOwnProperty('f'))
      assert(!refs.hasOwnProperty('g'))
      assert.equal(refs.h, element2)
    })

    it('maintains references to child component instances based on their `ref` property', function () {
      class ChildComponentA {
        constructor (props) {
          this.element = document.createElement('div')
        }

        update (props) {}
      }

      class ChildComponentB {
        constructor (props) {
          this.element = document.createElement('div')
        }

        update (props) {}
      }

      const refs = {}
      const virtualNode1 = <div><ChildComponentA ref='child' /></div>
      render(virtualNode1, {refs})
      assert(refs.child instanceof ChildComponentA)

      const virtualNode2 = <div><ChildComponentA ref='kid' /></div>
      patch(virtualNode1, virtualNode2, {refs})
      assert(!refs.child, 'Old ref was deleted')
      assert(refs.kid instanceof ChildComponentA)

      const virtualNode3 = <div><ChildComponentB ref='child' /></div>
      patch(virtualNode2, virtualNode3, {refs})
      assert(!refs.kid, 'Old ref was deleted')
      assert(refs.child instanceof ChildComponentB)

      const virtualNode4 = <div><ChildComponentA ref='child' /></div>
      patch(virtualNode3, virtualNode4, {refs})
      assert(refs.child instanceof ChildComponentA)
    })
  })

  describe('event handlers', function () {
    it('registers event handlers from the `on` property', function () {
      let listenerCalls = []
      function recordEvent (event) {
        listenerCalls.push({context: this, event})
      }

      const virtualNode1 = <div on={{
        'a': recordEvent,
        'b': recordEvent
      }} />
      const element = render(virtualNode1)

      element.dispatchEvent(new CustomEvent('a'))
      element.dispatchEvent(new CustomEvent('b'))
      assert.equal(listenerCalls.length, 2)
      assert.equal(listenerCalls[0].context, element)
      assert.equal(listenerCalls[0].event.type, 'a')
      assert.equal(listenerCalls[1].context, element)
      assert.equal(listenerCalls[1].event.type, 'b')

      const virtualNode2 = <div on={{
        'b': recordEvent,
        'c': recordEvent
      }} />
      patch(virtualNode1, virtualNode2)

      listenerCalls = []
      element.dispatchEvent(new CustomEvent('a'))
      element.dispatchEvent(new CustomEvent('b'))
      element.dispatchEvent(new CustomEvent('c'))
      assert.equal(listenerCalls.length, 2)
      assert.equal(listenerCalls[0].context, element)
      assert.equal(listenerCalls[0].event.type, 'b')
      assert.equal(listenerCalls[1].context, element)
      assert.equal(listenerCalls[1].event.type, 'c')

      const virtualNode3 = <div />
      patch(virtualNode2, virtualNode3)
      listenerCalls = []
      element.dispatchEvent(new CustomEvent('a'))
      element.dispatchEvent(new CustomEvent('b'))
      element.dispatchEvent(new CustomEvent('c'))
      assert.equal(listenerCalls.length, 0)
    })

    it('binds event listeners with the specified `listenerContext` value, if provided', function () {
      const listenerContext = {}
      let listenerCalls = []
      function recordEvent (event) {
        listenerCalls.push({context: this, event})
      }

      const virtualNode1 = <div on={{'a': recordEvent}} />
      const element = render(virtualNode1, {listenerContext})

      element.dispatchEvent(new CustomEvent('a'))
      assert.equal(listenerCalls.length, 1)
      assert.equal(listenerCalls[0].context, listenerContext)
      assert.equal(listenerCalls[0].event.type, 'a')

      const virtualNode2 = <div on={{'b': recordEvent}} />
      patch(virtualNode1, virtualNode2, {listenerContext})

      listenerCalls = []
      element.dispatchEvent(new CustomEvent('a'))
      element.dispatchEvent(new CustomEvent('b'))
      assert.equal(listenerCalls.length, 1)
      assert.equal(listenerCalls[0].context, listenerContext)
      assert.equal(listenerCalls[0].event.type, 'b')
    })

    it('allows event listeners to be nulled', function () {
      const virtualNode1 = <div onClick={() => {}} />
      const virtualNode2 = <div onClick={null} />
      const element = render(virtualNode1)
      assert.doesNotThrow(
        () => { patch(virtualNode1, virtualNode2 ,{listenerContext: {}}) },
        "Cannot read property 'bind' of null"
      )
    })

    it('allows standard event listeners to be specified as props like onClick or onMouseDown', function () {
      let listenerCalls = []
      function recordEvent (event) {
        listenerCalls.push(event)
      }
      const element = render(<div onClick={recordEvent} onMouseDown={recordEvent} />)

      element.dispatchEvent(new MouseEvent('click'))
      element.dispatchEvent(new MouseEvent('mousedown'))
      assert.equal(listenerCalls.length, 2)
      assert.equal(listenerCalls[0].type, 'click')
      assert.equal(listenerCalls[1].type, 'mousedown')
    })
  })

  describe('child components', function () {
    it('can insert, update, and remove components', function () {
      class Component {
        constructor (props, children) {
          this.props = props
          this.children = children
          this.updateCount = 0
          this.destroyCount = 0
          this.virtualNode = this.render()
          this.element = render(this.virtualNode)
        }

        update (props, children) {
          this.props = props
          this.children = children
          this.updateCount++
          const oldVirtualNode = this.virtualNode
          this.virtualNode = this.render()
          patch(oldVirtualNode, this.virtualNode)
        }

        destroy () {
          this.destroyCount++
        }

        render () {
          return <div class={this.props.class}>{this.children}</div>
        }
      }

      const refs = {}
      const virtualNode1 = <div />
      const element = render(virtualNode1, {refs})
      const virtualNode2 = (
        <div>
          <Component ref='component' class='child-component'>
            <div />
            <span />
          </Component>
        </div>
      )
      patch(virtualNode1, virtualNode2, {refs})
      const component = refs.component
      assert.equal(element.firstChild, component.element)
      assert.equal(element.outerHTML, render(
        <div>
          <div class='child-component'>
            <div />
            <span />
          </div>
        </div>
      ).outerHTML)

      const virtualNode3 = (
        <div>
          <Component ref='component' class='kid-component'>
            <p />
          </Component>
        </div>
      )
      patch(virtualNode2, virtualNode3, {refs})
      assert.equal(component.updateCount, 1)
      assert.equal(element.outerHTML, render(
        <div>
          <div class='kid-component'>
            <p />
          </div>
        </div>
      ).outerHTML)

      const virtualNode4 = <div />
      patch(virtualNode3, virtualNode4, {refs})
      assert.equal(component.updateCount, 1)
      assert.equal(component.destroyCount, 1)
      assert.equal(element.outerHTML, render(<div/>).outerHTML)
    })

    it('can replace normal elements with components and vice-versa', () => {
      class Component {
        constructor () {
          this.element = render(<span/>)
        }
        update () {}
      }

      const refs = {}
      const virtualNode1 = <div><div ref='a'/></div>
      const element = render(virtualNode1, {refs})
      const virtualNode2 = <div><Component ref='a'/></div>
      patch(virtualNode1, virtualNode2, {refs})

      assert.equal(element.outerHTML, '<div><span></span></div>')
      assert(refs.a instanceof Component)

      const virtualNode3 = <div><a ref='a'/></div>
      patch(virtualNode2, virtualNode3, {refs})
      assert.equal(element.outerHTML, '<div><a></a></div>')
      assert(refs.a instanceof HTMLElement)
    })

    it('can handle components that change their root element during update', () => {
      class Component {
        constructor (props) {
          this.element = document.createElement(props.rootElement)
        }
        update (props) {
          this.element = document.createElement(props.rootElement)
        }
      }

      const refs = {}
      const virtualNode1 = <div><Component rootElement='div'/></div>
      const element = render(virtualNode1)
      assert.equal(element.outerHTML, '<div><div></div></div>')

      const virtualNode2 = <div><Component rootElement='span'/></div>
      patch(virtualNode1, virtualNode2, {refs})
      assert.equal(element.outerHTML, '<div><span></span></div>')

      const virtualNode3 = <div><Component rootElement='a'/></div>
      patch(virtualNode2, virtualNode3, {refs})
      assert.equal(element.outerHTML, '<div><a></a></div>')
    })
  })

  describe('svg elements', function () {
    it('can insert, delete, update and move nodes', function () {
      assertValidPatch(
        <svg>
          <text>Hello, world</text>
          <circle strokeWidth='3' />
          <ellipse cx='2' />
        </svg>,
        <svg>
          <text>Goodbye, moon</text>
          <path cx='1' />
          <circle strokeWidth='5' />
          <g fill='none'>
            <path stroke='red' />
          </g>
        </svg>
      )
    })

    it('can update the innerHTML property', function () {
      assertValidPatch(
        <svg innerHTML="<circle></circle>"></svg>,
        <svg innerHTML="<ellipse></ellipse>"></svg>
      )
    })
  })
})

function assertValidPatch (oldVirtualNode, newVirtualNode, seed) {
  const node = render(oldVirtualNode)
  patch(oldVirtualNode, newVirtualNode)
  const message = seed != null ? `Invalid patch for seed ${seed}` : undefined
  assert.equal(node.outerHTML, render(newVirtualNode).outerHTML, message)
}

function spans (...elements) {
  return elements.map(element => <span>{element}</span>)
}

function keyedSpans (...elements) {
  return elements.map(element => <span key={element}>{element}</span>)
}

function randomLetters (randomGenerator) {
  const letters = []
  const usedLetters = new Set()
  const count = randomGenerator(27)

  for (let i = 0; i < count; i++) {
    const letter = String.fromCharCode('a'.charCodeAt(0) + randomGenerator(27))
    if (!usedLetters.has(letter)) {
      letters.push(letter)
      usedLetters.add(letter)
    }
  }

  return letters
}
