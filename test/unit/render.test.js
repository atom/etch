/** @jsx dom */

import {assert} from 'chai'

import dom from '../../src/dom'
import render from '../../src/render'

describe('render', () => {
  it('constructs DOM elements from virtual DOM trees', function () {
    const element = render(
      <div class='foo'>
        <div class='bar' />
        Hello World
        <span class='baz' />
      </div>
    )

    assert.equal(element.outerHTML, `
      <div class="foo">
        <div class="bar"></div>
        Hello World
        <span class="baz"></span>
      </div>
    `.replace(/\n\s*/g, ''))
  })

  it('constructs child components and embeds their elements', function () {
    class Component {
      constructor (props, children) {
        this.element = render(
          <span class={props.class}>
            {children}
          </span>
        )
      }
    }

    const element = render(
      <div class='foo'>
        <Component class='bar'>
          <div class='grandchild1' />
          <div class='grandchild2' />
        </Component>
      </div>
    )

    assert.equal(element.outerHTML, `
      <div class="foo">
        <span class="bar">
          <div class="grandchild1"></div>
          <div class="grandchild2"></div>
        </span>
      </div>
    `.replace(/\n\s*/g, ''))
  })
})
