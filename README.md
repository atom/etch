# etch

Etch is a library for writing HTML-based user interface components that provides the convenience of a **virtual DOM**, while at the same time striving to be **minimal**, **interoperable**, and **explicit**. Etch can be used anywhere, but it was specifically designed with **Atom packages** and **Electron applications** in mind.

### Overview

Etch components are ordinary JavaScript objects that conform to a minimal interface. Instead of inheriting from a superclass or building your component with a factory method, you access Etch's functionality by passing your component to Etch's library functions at specific points of your component's lifecycle. A typical component is structured as follows:

```js
/** @jsx etch.dom */

import etch from 'etch'

class MyComponent {
  // Required: Define an ordinary constructor to initialize your component.
  constructor (props, children) {
    // perform custom initialization here...
    // then call `etch.initialize`:
    etch.initialize(this)
  }

  // Required: The `render` method returns a virtual DOM tree representing the
  // current state of the component. Etch will call `render` to build and update
  // the component's associated DOM element. Babel is instructed to call the
  // `etch.dom` helper in compiled JSX expressions by the `@jsx` pragma above.
  render () {
    return <div></div>
  }

  // Optional: Update the component with new properties and children
  update (props, children) {
    // perform custom update logic here...
    // then call `etch.update`, which is async and returns a promise
    return etch.update(this)
  }

  // Optional: Destroy the component. Async/await syntax is pretty but optional.
  async destroy () {
    // call etch.destroy to remove the element and destroy child components
    await etch.destroy(this)
    // then perform custom teardown logic here...      
  }
}
```

The component defined above could be used as follows:

```js
// build a component instance in a standard way...
let component = new MyComponent({foo: 1, bar: 2})

// use the component's associated DOM element however you wish...
document.body.appendChild(component.element)

// update the component as needed...
await component.update({bar: 2})

// destroy the component when done...
await component.destroy()
```

Note that using an Etch component does not require a reference to the Etch library. Etch is an implementation detail, and from the outside the component is just an ordinary object with a simple interface and an `.element` property. You can also take a more declarative approach by embeddding Etch components directly within other Etch components, which we'll cover later in this document.

### Etch Lifecycle Functions

Use Etch's three lifecycle functions to associate a component with a DOM element, update that component's DOM element when the component's state changes, and tear down the component when it is no longer needed.

#### `etch.initialize(component)`

This function associates a component object with a DOM element. Its only requirement is that the object you pass to it has a `render` method that returns a virtual DOM tree constructed with the `etch.dom` helper ([Babel][babel] can be configured to compile JSX expressions to `etch.dom` calls). This function calls `render` and uses the result to build a DOM element, which it assigns to the `.element` property on your component object. `etch.initialize` also assigns any references (discussed later) to a `.refs` object on your component.

This function is typically called at the end of your component's constructor:

```js
/** @jsx etch.dom */

import etch from 'etch'

class MyComponent {
  constructor (properties) {
    this.properties = properties
    etch.initialize(this)
  }

  render () {
    return <div>{this.properties.greeting} World!</div>
  }
}

let component = new MyComponent({greeting: 'Hello'})
console.log(component.element.outerHTML) // ==> <div>Hello World!</div>
```

#### `etch.update(component)`

This function takes a component that is already associated with an `.element` property and updates the component's DOM element based on the current return value of the component's `render` method.

`etch.update` is asynchronous, batching multiple DOM updates together in a single animation frame for efficiency. Even if it is called repeatedly with the same component in a given event-loop tick, it will only perform a single DOM update per component on the next animation frame. That means it is safe to call `etch.update` whenever your component's state changes, even if you're doing so redundantly. This function returns a promise that resolves when the DOM update has completed.

`etch.update` should be called whenever your component's state changes in a way that affects the results of `render`. For a basic component, you can implement an `update` method that updates your component's state and then requests a DOM update via `etch.update`. Expanding on the example from the previous section:

```js
/** @jsx etch.dom */

import etch from 'etch'

class MyComponent {
  constructor (properties) {
    this.properties = properties
    etch.initialize(this)
  }

  render () {
    return <div>{this.properties.greeting} World!</div>
  }

  update (newProperties) {
    if (this.properties.greeting !== newProperties.greeting) {
      this.properties.greeting = newProperties.greeting
      return etch.update(this)
    } else {
      return Promise.resolve()
    }
  }
}

// in an async function...

let component = new MyComponent({greeting: 'Hello'})
console.log(component.element.outerHTML) // ==> <div>Hello World!</div>
await component.update({greeting: 'Salutations'})
console.log(component.element.outerHTML) // ==> <div>Salutations World!</div>
```

There is also a synchronous variant, `etch.updateSync`, which performs the DOM update immediately. It doesn't skip redundant updates or batch together with other component updates, so you shouldn't really use it unless you have a clear reason.

One caveat is that it's not possible to update the root tag name of a component. This is because we want to maintain a 1:1 relationship between components and their elements, and changing the root tag name would require us to replace the component's element with a new one. While this is certainly doable, it comes with complexity trade-offs we're not currently willing to make. Instead of swapping root tags, implement subtrees of your DOM that change their root tag as method calls on another component rather than their own components.

#### `etch.destroy(component)`

When you no longer need a component, pass it to `etch.destroy`. This function will remove the component from the document and call `destroy` on any child components (child components are covered later in this document). `etch.destroy` is also asynchronous so that it can combine the removal of DOM elements with other DOM updates, and it returns a promise that resolves when the removal has completed.

`etch.destroy` is typically called in an async `destroy` method on the component:

```js
class MyComponent {
  // other methods omitted for brevity...

  async destroy () {
    await etch.destroy(this)

    // perform component teardown... here we just log for example purposes
    let greeting = this.properties.greeting
    console.log(`Destroyed component with greeting ${greeting}`)
  }
}

// in an async function...

let component = new MyComponent({greeting: 'Hello'})
document.body.appendChild(component.element)
assert(component.element.parentElement)
await component.destroy()
assert(!component.element.parentElement)
```

### Component Composition

#### Nesting Etch Components Within Other Etch Components

Components can be nested within other components by referencing a child component's constructor in the parent component's `render` method, as follows:

```js
/** @jsx etch.dom */

import etch from 'etch'

class ChildComponent {
  constructor () {
    etch.initialize(this)
  }

  render () {
    return <h2>I am a child</h2>
  }
}

class ParentComponent {
  constructor () {
    etch.initialize(this)
  }

  render () {
    <div>
      <h1>I am a parent</div>
      <ChildComponent />
    </div>
  }
}
```

A constructor function can always take the place of a tag name in any Etch JSX expression. If the JSX expression has properties or children, these will be passed to the constructor function as the first and second argument, respectively.

```js
/** @jsx etch.dom */

import etch from 'etch'

class ChildComponent {
  constructor (properties, children) {
    this.properties = properties
    this.children = children
    etch.initialize(this)
  }

  render () {
    return (
      <div>
        <h2>I am a {this.properties.adjective} child</h2>
        <h2>And these are *my* children:</h2>
        {this.children}
      </div>
    )
  }
}

class ParentComponent {
  constructor () {
    etch.initialize(this)
  }

  render () {
    <div>
      <h1>I am a parent</div>
      <ChildComponent adjective='good'>
        <div>Grandchild 1</div>
        <div>Grandchild 2</div>
      <ChildComponent/>
    </div>
  }
}
```

If the properties or children change during an update of the parent component, Etch calls `update` on the child component with the new values. If `update` is not implemented on the child, the component is destroyed and replaced with a new component that is constructed with the new values.

Finally, if an update causes the child component to no longer appear in the DOM or the parent component itself is destroyed, Etch will call `destroy` on the child component if it is implemented.

#### Functions as Etch Components

If your component is very simple and doesn't need to track any state internally, it can be easier to describe it as a pure function of properties and children. Etch supports this case; simply use a function as a tag name:

```javascript
function FuncComponent(props, children) {
  return <div className={props.someProp}>{children}</div>
}

class MyComponent {
  // other methods omitted for brevity...
  render () {
    return <div><FuncComponent someProp={value}>With Children</FuncComponent>
  }
}
```

#### Nesting Non-Etch Components Within Etch Components

Nothing about the component composition rules requires that the child component be implemented with Etch. So long as your constructor builds an object with an `.element` property, it can be nested within an Etch virtual DOM tree. Your component can implement `update` and `destroy` if you want to participate in the parent component's lifecycle, but these methods are not required.

This feature makes it easy to mix components written in different versions of Etch or wrap components written in other technologies for integration into an Etch component. You can even just use raw DOM APIs for simple or performance critical components and use them straightforwardly within Etch.

### References

Etch interprets any `ref` property on a virtual DOM element as an instruction to wire a reference to the underlying DOM element or child component. These references are collected in a `refs` object that Etch assigns on your component.

```js
class ParentComponent {
  constructor () {
    etch.initialize(this)
  }

  render () {
    <div>
      <span ref='greetingSpan'>Hello</span>
      <ChildComponent ref='childComponent' />
    </div>
  }
}

let component = new ParentComponent()
component.refs.greetingSpan // This is a span DOM node
component.refs.childComponent // This is a ChildComponent instance
```
Note that `ref` properties on normal HTML elements create references to raw DOM nodes, while `ref` properties on child components create references to the constructed component object, which makes its DOM node available via its `element` property.

### Organizing Component State

Other frameworks combine the virtual-DOM-based updating facilities enabled by this library with a more prescriptive approach to organizing component state. For example, React components tie their update lifecycle to changes in `props` and `state` objects that are baked into all components.

Etch deliberately avoids prescribing a specific approach to component state, and instead gives you the tools to make your own decisions about when the component should update. Etch never touches the DOM without you explicitly requesting it via `etch.update`. This keeps the surface area of the library smaller and gives you the flexibility to approach updates in a manner appropriate to your use case. That said, here are some patterns you can use:

#### View Models

For interface elements of even moderate complexity, the best approach is to separate logic from presentation by creating a *view model*. The view model should be implemented as a straightforward JS object model and implement all the logic for the component. In this pattern, the component plays a limited role: It should call `etch.update` when the model changes and implement `render` by querying the model. It should also translate DOM events to method calls on the model.

A model-oriented approach is much easier to test and offers better separation of concerns, at the cost of slightly more code due to maintaining a separate component and model. It's easier and more performant to test as much behavior as possible without involving the DOM, then write a lighter set of integration tests against the component. While the virtual DOM radically reduces the complexity of view-related logic, it's still helpful to keep code in the component focused solely on managing the DOM.

#### Everything In The Component

If you want to maintain all state and behavior directly in the component, similar to a vanilla React application, that's also possible. You can deal with this in as simple or a complex a way as you want. At the simple end, just assign state on your component in instance variables that you read in `render` and call `etch.update` when you change it. At the more complex end, you could implement properties and state containers that call various hooks on your component and invoke `etch.update` automatically.

#### Fancy View Pattern Of The Month

Implementing UI in Etch boils down to the following: Read from some source of state in `render`, call `etch.update` when that state changes, and translate events into the appropriate changes to that state. Beyond this, nothing is prescribed, and you should be pretty free to experiment with interesting patterns. Implement your ideas as a library that wraps Etch to season more behavior into components, and chart your path to glory. Just please don't assign any globals.

### Customizing The Scheduler

Etch exports a `setScheduler` method that allows you to override the scheduler it uses to coordinate DOM writes. When using Etch inside a larger application, it may be important to coordinate Etch's DOM interactions with other libraries to avoid synchronous reflows.

For example, when using Etch in Atom, you should set the scheduler as follows:

```js
etch.setScheduler(atom.views)
```

Read comments in the [scheduler assignment][scheduler-assignment] and [default scheduler][default-scheduler] source code for more information on implementing your own scheduler.

### Handling Events

This library doesn't currently prescribe or support a specific approach to binding event handlers. We are considering an API that integrates inline handlers directly into JSX expressions, but we're not convinced the utility warrants the added surface area.

Compared to efficiently updating the DOM declaratively (the primary focus of this library), binding events is a pretty simple problem. You might try [dom-listener][dom-listener] if you're looking for a library that you could combine with Etch to deal with event binding.

### Feature Requests

Etch aims to stay small and focused. If you have a feature idea, consider implementing it as a library that either wraps Etch or, even better, that can be used in concert with it. If it's impossible to implement your feature outside of Etch, we can discuss adding a hook that makes your feature possible.

[babel]: https://babeljs.io/
[scheduler-assignment]: https://github.com/nathansobo/etch/blob/master/src/scheduler-assignment.js
[default-scheduler]: https://github.com/nathansobo/etch/blob/master/src/default-scheduler.js
[dom-listener]: https://github.com/atom/dom-listener
