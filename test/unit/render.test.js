/** @jsx etch.dom */

import etch from '../../src/index'

describe('etch.render(vnode)', () => {
  it('creates an element from raw VNodes', () => {
    let element = etch.render(<div>Hello World</div>)
    expect(element.textContent).to.equal('Hello World')
  })

  it('creates an element from component VNodes', () => {
    class Component {
      constructor({text}, children) {
        this.text = text
        this.children = children
        etch.initialize(this)
      }

      render () {
        return <div>{this.text} {this.children}</div>
      }

      update ({text}, children) {}
    }
    let element = etch.render(<Component text="Hi">World</Component>)
    expect(element.textContent).to.equal('Hi World')
  })
})
