/** @jsx dom */

import {assert} from 'chai'
import Random from 'random-seed'

import dom from '../../src/dom'
import render from '../../src/render'
import patch from '../../src/patch'

describe('patch', () => {
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
})

function assertValidPatch (oldVirtualNode, newVirtualNode, seed) {
  const element = render(oldVirtualNode)
  patch(element, newVirtualNode)
  const message = seed != null ? `Invalid patch for seed ${seed}` : undefined
  assert.deepEqual(element, render(newVirtualNode), message)
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
