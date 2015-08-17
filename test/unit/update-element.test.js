/** @jsx etch.dom */

import etch from '../../src/index'

describe('etch.updateElement(component)', () => {
  it('schedules an update of the element associated with the component', async () => {
    let component = {
      greeting: 'Hello',

      render () {
        return <div>{this.greeting} World</div>
      }
    }

    let element = etch.createElement(component)
    expect(element.textContent).to.equal('Hello World')

    component.greeting = 'Goodbye'
    etch.updateElement(component)

    await etch.getScheduler().getNextUpdatePromise()

    expect(element.textContent).to.equal('Goodbye World')
  });

  it('updates references to DOM elements', async () => {
    let component = {
      condition: true,

      render () {
        if (this.condition) {
          return <div><span ref='greeting'>Hello</span></div>
        } else {
          return <div><span ref='greeted'>World</span></div>
        }
      }
    }
    etch.createElement(component)

    expect(component.refs.greeting.textContent).to.equal('Hello')
    expect(component.refs.greeted).to.be.undefined

    component.condition = false
    etch.updateElement(component)

    await etch.getScheduler().getNextUpdatePromise()

    expect(component.refs.greeted.textContent).to.equal('World')
    expect(component.refs.greeting).to.be.undefined
  });
});
