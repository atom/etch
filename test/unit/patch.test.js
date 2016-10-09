/** @jsx dom */

import {assert} from 'chai'

import dom from '../../src/dom'
import render from '../../src/render'
import patch from '../../src/patch'

describe('patch', () => {
  describe('attributes', function () {
    it('can add, remove, and update attributes', function () {
      const element = render(<div a='1' b='2' />)
      patch(element, <div b='3' c='4' />)
      assert.deepEqual(element, render(<div b='3' c='4' />))
    })
  })
})
