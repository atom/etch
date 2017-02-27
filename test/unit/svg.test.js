/** @jsx etch.dom */

const etch = require('../../lib/index')

describe('svg support', () => {
  it('sets the correct tag thingies', () => {
    let component = {
      render () {
        return <svg><path ref='path' /></svg>
      },

      update () {}
    }

    etch.initialize(component)
    let elem = component.element
    expect(elem.constructor).to.equal(SVGSVGElement)
    // expect(component.refs.path.tagName).to.equal('PATH')
  })

  it('translates className props to class', () => {
    let component = {
      render () {
        return <svg className='myclass' />
      },

      update () {}
    }

    etch.initialize(component)
    expect(component.element.classList[0]).to.equal('myclass')
  })
})
