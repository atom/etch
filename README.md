# etch

**Warning:** This library is work-in-progress and hasn't been used in production yet.

Etch is a minimal view library optimized for Electron and Atom package development. It combines HTML 5 custom elements, the `virtual-dom` library, and  model observation based on `Object.observe` into a minimal, easy-to-swallow package.

### Custom Elements + Virtual DOM

Etch custom elements define a `render` method, which returns a fragment of virtual DOM just like React components. The element's content will be updated based on the virtual DOM when it is attached to the document or when `.update()` is called on the element. Note, all these examples assume the use of the Babel transpiler. To use Babel in Atom, write `'use babel'` as the first line of your file.

```js
// Tell Babel how to compile JSX:
/** @jsx etch.dom */

import etch from 'etch'

// Register a custom element
etch.registerElement('task-list', {
  // Define the element's content via a `render` method
  render () {
    return (
      <task-list>
        <h1>Tasks:</h1>
        <ol>{
          this.tasks.map(task =>
            <li className='task' key={task.id}>
              <input type='checkbox' checked={task.completed}>
              task.description
            </li>
          )
        }</ol>
      </task-list>
    )
  },

  initialize (tasks) {
    this.tasks = tasks
    return this
  }
})

// Define a simple data model
let tasks = [
  {id: 1, description: 'Write README', completed: true},
  {id: 2, description: 'Build etch example package', completed: false}
]
let taskListElement = document.createElement('task-list').initialize(tasks)

// Populate element content based result of `render` method on attachment:
document.body.appendChild(taskListElement)

// Manually trigger a diff-based DOM update at any time with `update`
tasks.push({id: 3, description: 'Feed cats', completed: false})
tasks[1].completed = true
taskListElement.update()
```

### Observing Your Data Model

That was just the basics. Mostly, you'll want to express your view as a function of your underlying data model by expressing the parts of your your virtual DOM that change as *observations* constructed via `etch.observe`. Instead of needing to call `.update()` manually, minimal subtrees of your document will update automatically whenever your data changes.

```js
/** @jsx etch.dom */

// the `observe` function wraps `Object.observe` and `Array.observe`, allowing
// you to directly express how pieces of your DOM tree map to the underlying
// data model:
import etch, {observe} from 'etch'

etch.registerElement('task-list', {
  render () {
    return (
      <task-list>
        <h1>Tasks:</h1>
        <ol>{
          // Here we map over an *observation* of an array, which allows the
          // DOM to be updated whenever elements are added or removed.
          observe(this.tasks).map(task =>
            <li className='task'>
              // Observations can be passed as properties:
              <input type='checkbox' checked={observe(task, 'completed')}>
              // Observations can also be passed as text content:
              observe(task, 'description')
            </li>
          )
        }</ol>
      </task-list>
    )
  },

  initialize (tasks) {
    this.tasks = tasks
  }
})

let tasks = ['Write README', 'Build example']
let taskListElement = document.createElement('task-list').initialize(tasks)

// No need to trigger an update when the data changes. It happens automatically.
tasks.push({id: 3, description: 'Feed cats', completed: false})
tasks[1].completed = true
```

You can freely mix observation and diff-based updates.

### Lifecycle Hooks

You can make use of the standard custom element callbacks by defining the following methods on your element's prototype during registration:

* `createdCallback` This is called after the element is first created, but before it is attached to the DOM. This is a good place to setup instance variables that will last through multiple attachments and detachments from the DOM.
* `attachedCallback` This is called after the element is attached to the DOM. Before this hook is invoked, the element's content will also be populated based on the `render` method.
* `detachedCallback` This is called after the element is detached from the DOM. The element's content will still be present when this hook is invoked, but the content will be cleared if the element isn't reattached before the end of the current event-loop tick.
* `attributeChangedCallback(attributeName, oldValue, newValue)` This hook is called whenever the element's attributes change.

When an element is moved from one place in the DOM to another within the same event-loop tick, the detached and attached callbacks are fired without the content being cleared. If an element is detached without being immediately reattached, its content is cleared to ensure subscriptions to observations in that content are disposed. The next time the element is attached, its content will be repopulated via a call to `render`.

### References

If you want to refer to a specific DOM node within your element, add a `ref` property to the element's virtual DOM node in your render method. This will automatically populate a `refs` object on the root element with a named reference to your node.

```js
etch.registerElement('task-list', {
  render () {
    return (
      <task-list>
        /* ... other content ... */
        <button ref='createTaskButton'>Create New Task</button>
      </task-list>
    )
  },

  createdCallback () {
    this.createTask = this.createTask.bind(this)
  },

  attachedCallback () {
    this.refs.createTaskButton.addEventListener(this.createTask)
  },

  detachedCallback () {
    this.refs.createTaskButton.removeEventListener(this.createTask)
  },

  createTask () { /* ... create task... */ }
```

### Event Handling

This library deliberately omits any special event-handling facilities, leaving you free to make your own choices in this regard. One good option is the [dom-listener](https://github.com/atom/dom-listener) library, which enables the event delegation pattern of associating event listeners with selectors. This decouples your event handlers from specific DOM nodes so you can setup your event handling once in your `createdCallback`:

```js
import DOMListener from 'dom-listener'

etch.registerElement('task-list', {
  render () { /* ... */ },

  createdCallback () {
    let listener = new DOMListener(this)
    listener.add('button', 'click', this.createTask.bind(this))
  }
}
```

### Roadmap

My goal is to keep this library small and focused, so I don't plan to add many features beyond what's present here unless a compelling case can be made for them. That said, here are a couple things I'm looking to add soon:

#### Anonymous Elements

Custom elements are a great way to integrate behavior with the DOM, but it can be a bummer to have to name every single component in a global namespace. I have some ideas for a way to get prototype customization and lifecycle hooks without having to register a global name. Ideally, I'd like that to be the preferred way of defining custom elements that are only used internally, saving name registration for elements you want to expose for other people to use.

#### Versioning

If you expose a named custom element in a library that you want other people to consume, how do you evolve its API? In the situation where custom elements are being used within a single web page, it's not a huge deal because a single person is in control of all the version choices. In an environment like Atom, it's problematic because different packages may depend on different versions of your component.

I'd like to make it possible to have multiple semantic versions of the same component running in the same document at the same time.

```js
// One version of the component
etch.registerElement('my-quickly-evolving-element', {
  version: '1.2.3'

  // ... implementation ...
})

// Another version of the component
etch.registerElement('my-quickly-evolving-element', {
  version: '2.3.0'

  // ... implementation ...
})
```

Then, in HTML, you'd specify the version you expect in a given context:

```html
<my-quickly-evolving-element version='^1.2.3'>
```

This ensures that when a newer version of a component is loaded into the environment for some reason, code that depends on older versions continues to work correctly.

#### Compatibility and Interoperability

Being based on standard browser elements already helps with this, but my overall goal is that it should be possible to mix components from any version of this library with any other version and have things continue to work smoothly. I won't go 1.0 until I have a plan in place for interoperating between 1.x and 2.x components at runtime.
