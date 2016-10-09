/** @jsx dom */

import {assert} from 'chai'

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
    it('can append children', function () {
      assertValidPatch(
        <div>{keyedSpans('a', 'b')}</div>,
        <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
      )
    })
  })
})

function assertValidPatch (oldVirtualNode, newVirtualNode) {
  const element = render(oldVirtualNode)
  patch(element, newVirtualNode)
  assert.deepEqual(element, render(newVirtualNode))
}

function keyedSpans (...elements) {
  return elements.map(element => <span key={element}>{element}</span>)
}
