"use babel";
/** @jsx dom */

import {dom, observe, createElement, diff, patch} from '../../src/index';

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

  it('allows scalar observations to be used as attributes', async () => {
    let model = {class: 'greeting'};
    let vnode = <div class={observe(model, 'class')}>Hello World</div>;

    let element = createElement(vnode);
    expect(element.className).to.equal('greeting');

    model.class = 'salutation';
    await scheduler.getNextUpdatePromise();

    expect(element.className).to.equal('salutation');

    let newModel = {class: 'greeting'};
    let newVnode = <div class={observe(newModel, 'class')}>Hello World</div>;
    patch(element, diff(vnode, newVnode));

    expect(element.className).to.equal('greeting');

    model.class = 'foo';
    newModel.class = 'bar';

    await scheduler.getNextUpdatePromise();

    expect(element.className).to.equal('bar');
  });

  it('allows scalar observations to be used as properties', async () => {
    let model = {property: 'bar'};
    let vnode = <div properties={{foo: observe(model, 'property')}}>Hello World</div>;

    let element = createElement(vnode);
    expect(element.foo).to.equal('bar');

    model.property = 'baz';
    await scheduler.getNextUpdatePromise();

    expect(element.foo).to.equal('baz');

    let newModel = {property: 'bar'}
    let newVnode = <div properties={{foo: observe(newModel, 'property')}}>Hello World</div>;
    patch(element, diff(vnode, newVnode));

    expect(element.foo).to.equal('bar');

    model.property = 'foo';
    newModel.property = 'qux';
    await scheduler.getNextUpdatePromise();

    expect(element.foo).to.equal('qux');
  });

  it('allows scalar observations to be used as children', async () => {
    let model = {greeting: 'Hello', greeted: 'World'};

    let vnode = <div>
      {observe(model, 'greeting', (greeting) => <span class="greeting">{greeting}</span>)}
      {observe(model, 'greeted', (greeted) => <span class="greeted">{greeted}</span>)}
    </div>;

    let element = createElement(vnode);
    expect(element.querySelector('.greeting').textContent).to.equal('Hello');
    expect(element.querySelector('.greeted').textContent).to.equal('World');

    model.greeting = 'Goodbye';
    await scheduler.getNextUpdatePromise();

    expect(element.querySelector('.greeting').textContent).to.equal('Goodbye');
    expect(element.querySelector('.greeted').textContent).to.equal('World');

    let newModel = {greeting: 'Hello', greeted: 'World'};
    let newVnode = <div>
      {observe(newModel, 'greeting', (greeting) => <span class="greeting">{greeting}</span>)}
      {observe(newModel, 'greeted', (greeted) => <span class="greeted">{greeted}</span>)}
    </div>;

    patch(element, diff(vnode, newVnode));

    expect(element.querySelector('.greeting').textContent).to.equal('Hello');
    expect(element.querySelector('.greeted').textContent).to.equal('World');

    newModel.greeting = 'Yo';
    model.greeting = 'Hey';
    await scheduler.getNextUpdatePromise();

    expect(element.querySelector('.greeting').textContent).to.equal('Yo');
    expect(element.querySelector('.greeted').textContent).to.equal('World');
  });

  it('allows scalar text observations to be used as children', async () => {
    let model = {greeting: 'Hello', greeted: 'World'};

    let vnode = <div>
      <span class="greeting">{observe(model, 'greeting')}</span>
      <span class="greeted">{observe(model, 'greeted')}</span>
    </div>;

    let element = createElement(vnode);
    expect(element.querySelector('.greeting').textContent).to.equal('Hello');
    expect(element.querySelector('.greeted').textContent).to.equal('World');

    return

    model.greeting = 'Goodbye';
    await scheduler.getNextUpdatePromise();

    expect(element.querySelector('.greeting').textContent).to.equal('Goodbye');
    expect(element.querySelector('.greeted').textContent).to.equal('World');

    let newModel = {greeting: 'Hello', greeted: 'World'};
    let newVnode = <div>
      {observe(newModel, 'greeting', (greeting) => <span class="greeting">{greeting}</span>)}
      {observe(newModel, 'greeted', (greeted) => <span class="greeted">{greeted}</span>)}
    </div>;

    patch(element, diff(vnode, newVnode));

    expect(element.querySelector('.greeting').textContent).to.equal('Hello');
    expect(element.querySelector('.greeted').textContent).to.equal('World');

    newModel.greeting = 'Yo';
    model.greeting = 'Hey';
    await scheduler.getNextUpdatePromise();

    expect(element.querySelector('.greeting').textContent).to.equal('Yo');
    expect(element.querySelector('.greeted').textContent).to.equal('World');
  });

  it('allows array observations to be used as children', async () => {
    let array = ['a', 'b', 'c'];

    let vnode = <ul>
      <li>X</li>
      {observe(array, item => <li>{item}</li>)}
      <li>Y</li>
      {observe(array, item => <li>{item.toUpperCase()}</li>)}
      <li>Z</li>
    </ul>;

    let element = createElement(vnode);

    expect(element.outerHTML).to.equal('<ul><li>X</li><li>a</li><li>b</li><li>c</li><li>Y</li><li>A</li><li>B</li><li>C</li><li>Z</li></ul>');

    array.splice(1, 1, 'd', 'e', 'f')
    await scheduler.getNextUpdatePromise();

    expect(element.outerHTML).to.equal('<ul><li>X</li><li>a</li><li>d</li><li>e</li><li>f</li><li>c</li><li>Y</li><li>A</li><li>D</li><li>E</li><li>F</li><li>C</li><li>Z</li></ul>');

    let newArray = ['a', 'b', 'c'];
    let newVnode = <ul>
      <li>X</li>
      {observe(newArray, item => <li>{item}</li>)}
      <li>Y</li>
      {observe(newArray, item => <li>{item.toUpperCase()}</li>)}
      <li>Z</li>
    </ul>;

    patch(element, diff(vnode, newVnode));

    expect(element.outerHTML).to.equal('<ul><li>X</li><li>a</li><li>b</li><li>c</li><li>Y</li><li>A</li><li>B</li><li>C</li><li>Z</li></ul>');

    newArray.length = 0;
    newArray.push('g', 'h')
    await scheduler.getNextUpdatePromise();

    expect(element.outerHTML).to.equal('<ul><li>X</li><li>g</li><li>h</li><li>Y</li><li>G</li><li>H</li><li>Z</li></ul>');
  });
});
