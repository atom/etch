/** @jsx dom */

import {assert} from 'chai'
import Random from 'random-seed'

import dom from '../../src/dom'
import render from '../../src/render'
import patch from '../../src/patch'

describe('patch (oldVirtualNode, newVirtualNode)', () => {
  describe('attributes', function () {
    it('can add, remove, and update attributes', function () {
      assertValidPatch(<div a='1' b='2' />, <div b='3' c='4' />)
    })

    it('can update from no attributes to some attributes and vice versa', function () {
      assertValidPatch(<div />, <div a='1' />)
      assertValidPatch(<div a='1' />, <div />)
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

      global.debug = true
      const virtualNode4 = <div />
      patch(virtualNode3, virtualNode4, {refs})
      assert.equal(component.updateCount, 1)
      assert.equal(component.destroyCount, 1)
      assert.equal(element.outerHTML, render(<div/>).outerHTML)
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
