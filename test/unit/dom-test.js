"use babel";
/** @jsx dom */

import {dom, observe, createElement} from '../../src/index';

describe('virtual DOM', () => {
  it('can construct elements based on scalar observations', async () => {
    let model = {greeting: 'Hello', greeted: 'World'};

    let vnodeObservation = observe(model, 'greeting', 'greeted', (greeting, greeted) =>
      <div>
        <span class="greeting">{greeting}</span>
        <span class="greeted">{greeted}</span>
      </div>
    );

    let element = createElement(vnodeObservation);
    expect(element.querySelector('.greeting').textContent).to.equal('Hello');
    expect(element.querySelector('.greeted').textContent).to.equal('World');

    model.greeting = 'Goodbye';
    await scheduler.getNextUpdatePromise();

    expect(element.querySelector('.greeting').textContent).to.equal('Goodbye');
    expect(element.querySelector('.greeted').textContent).to.equal('World');

    model.greeted = 'Moon';
    await scheduler.getNextUpdatePromise();

    expect(element.querySelector('.greeting').textContent).to.equal('Goodbye');
    expect(element.querySelector('.greeted').textContent).to.equal('Moon');
  });
});
