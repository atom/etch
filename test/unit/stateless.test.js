/** @jsx etch.dom */

import etch from '../../src/index'

describe('etch.stateless(render)', () => {
  it('renders with props and children', () => {
    let Component = etch.stateless((props, children) => {
      return <div>{children}{props.hello}</div>
    })
    let component = new Component({hello: " world"}, <span>Hello</span>)

    expect(component.element.textContent).to.equal('Hello world')
  })

  it('updates with new props and children', async () => {
    let Component = etch.stateless((props, children) => {
      return <div>{children}{props.hello}</div>
    })
    let component = new Component({hello: " world"}, <span>Hello</span>)
    await component.update({hello: " Etch"}, <span>Howdy</span>)

    expect(component.element.textContent).to.equal('Howdy Etch')
  })
})
