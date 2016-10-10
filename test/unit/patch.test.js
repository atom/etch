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

  describe('child components', function () {
    it('can insert a component', function () {
      class Component {
        constructor (props, children) {
          this.element = render(<div class={props.class}>{children}</div>)
        }
      }

      assertValidPatch(
        <div></div>,
        <div>
          <Component class='child-component'>
            <div />
            <span />
          </Component>
        </div>
      )
    })

    it('can remove a component and call destroy', function () {
      const createdInstances = []
      const destroyedInstances = []

      class Component {
        constructor () {
          this.element = render(<div class='component' />)
          createdInstances.push(this)
        }

        destroy () {
          destroyedInstances.push(this)
        }
      }

      assertValidPatch(
        <div><Component /></div>,
        <div />
      )

      assert.equal(destroyedInstances.length, 1)
      assert.deepEqual(destroyedInstances, [createdInstances[0]])
    })

    it('can update an existing component', function () {
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
