# etch

Etch is a library for writing HTML-based view components that provides the convenience of a **virtual DOM** while at the same time striving to be **minimal**, **interoperable**, and **explicit**. Etch can be used anywhere, but it was specifically designed with **Atom packages** and **Electron applications** in mind.

### Overview

In the example below, we define a simple `TaskListComponent` using ES6 syntax enabled by the [Babel transpiler][babel]. Our component's `render` method returns a JSX expression describing the desired content of our component as a function of an underlying data model.

```js
/** @jsx etch.dom */

import etch from 'etch'

export default class TaskListComponent {
  // The constructor assigns initial state, then associates the component with
  // an element via `etch.createElement`
  constructor ({tasks}) {
    this.tasks = tasks
    etch.createElement(this)
  }

  // When your component's element is created or updated, its content will be
  // based on the result of the `render` method.
  render () {
    return (
      <div className='task-list'>
        <h1>Tasks:</h1>
        <ol>{
          this.tasks.map(task =>
            <li className='task' key={task.id}>
              <input type='checkbox' checked={task.completed}>
              {task.description}
            </li>
          )
        }</ol>
      </div>
    )
  }

  // This method adds a task, then schedules a DOM update on the next animation
  // frame via `etch.updateElement`
  addTask (task) {
    this.tasks.push(task)
    etch.updateElement(this)
  }
}
```

Etch favors composition over inheritance, meaning your components can be arbitrary objects that implement a `render` method. In the constructor, we call `etch.createElement` with the newly-created component. `etch.createElement` then calls our `render` method to create an element and assign it to the `element` property on the component. Later, when we update the data model in `addTask`, we call `etch.updateElement` with the component, which calls `render` again and updates the component's element via a diff with its previous content.

Now let's use the component we just defined...

```js
let taskList = new TaskListComponent({tasks: [
  {id: 1, description: 'Write README', completed: true},
  {id: 2, description: 'Build etch example package', completed: false}  
]})
document.body.appendChild(taskList.element)
taskList.addTask({id: 3, description: 'Feed cats', completed: false})
```

Note that when we want to *use* the component, we don't have to interact with any Etch APIs. The component is an ordinary object that can be constructed normally. After construction, its `element` property points at a DOM node that is ready to use and can be appended to the document using standard APIs. This enables straightforward *interoperability* between our component and any code that works with standard DOM elements.

Also note that the decision to update the element's content in the `addTask` method is *explicit*. If you want to build a property store that calls `etch.updateElement` automatically when values change, that's easy to do, but no specific state management system is prescribed, and nothing happens automatically by default.

### Composition

Say we wanted to extract a `TaskComponent` for each task in our list...

```js
/** @jsx etch.dom */

import etch from 'etch'

export default class TaskComponent {
  constructor ({task}) {
    this.task = task
    etch.createElement(this)
  }

  update ({task}) {
    this.task = task
    etch.updateElement(this)
  }

  render () {
    return (
      <li className='task' key={this.task.id}>
        <input type='checkbox' checked={this.task.completed}>
        {this.task.description}
      </li>
    )
  }
}
```

To use this component within our task list, we can reference its constructor directly in JSX expressions. We'll add a "featured task" above the list to spice up the example.

```js
/** @jsx etch.dom */

import etch from 'etch'
import TaskComponent from './task-component'

export default class TaskListComponent {
  constructor ({tasks, featuredTask}) {
    this.tasks = tasks
    this.featuredTask = featuredTask
    etch.createElement(this)
  }

  render () {
    return (
      <div className='task-list'>
        <h1>Featured Task:</h1>
        <TaskComponent task={this.featuredTask} />
        <h1>Tasks:</h1>
        <ol>{
          this.tasks.map(task => <TaskComponent task={task} key={task.id} />)
        }</ol>
      </div>
    )
  }
}
```

Now, everywhere a `TaskComponent` constructor is used in the JSX, a `TaskComponent` component instance will be instantiated and its associated `element` will be inserted into the DOM. If any the attributes of a JSX expression containing a `TaskComponent` change on a subsequent call to `render`, the `update` method will be called on the component if it exists. Otherwise, a new component will be instantiated with the new property values and the original component's element will be replaced.

In addition to embedding other Etch components, you can pass an arbitrary constructor function to `etch.dom` in your JSX expressions conforming to the following interface:

* Your function must be a constructor. It will be called with the `new` keyword and passed the JSX expression's properties and children as arguments.
* The component object returned by your constructor must have an `element` field pointing to a DOM node. This element will be inserted into the DOM.
* The component object returned by your constructor may have an `update` method. This method will be called whenever the same function appears in the same location in successive calls to `render`.

### References

If any of your JSX expressions have a magic `ref` attribute, a reference will automatically be created to the resulting DOM node. In the example below, we use the `ref` property on a button element to automatically assign `refs.newButton` on the component.

```js
export default class TaskListComponent {
  constructor ({tasks}) {
    this.tasks = tasks
    etch.createElement(this)
    this.refs.newButton.addEventListener('click', this.newTask.bind(this))
  }

  render () {
    return (
      <div className='task-list'>
        <button className='.btn.new' ref='newButton'>Create Task</button>
        <h1>Tasks:</h1>
        <ol>{
          this.tasks.map(task => <TaskComponent task={task} key={task.id} />)
        }</ol>
      </div>
    )
  }

  newTask () { /* ... */ }
}
```

If expressions with component constructors have a `ref` attribute, the reference points to the component object rather than the element. You can always access the element via the `element` field on the component object.

### Events

In the spirit of minimalism, Etch does not currently bake in any event handling directly into the library. If you want to use the event delegation pattern, you might try the [dom-listener][dom-listener] library.

```js
import etch from 'etch'
import DOMListener from 'dom-listener'

class TaskList {
  constructor ({tasks}) {
    this.tasks = tasks
    etch.createElement(this)

    // Handle events...
    let listener = new DOMListener(this.element)
    listener.add('.btn.new', 'click', this.newTask.bind(this))
  }

  /* ... */
}
```

### Lifecycle Hooks

Earlier versions of this library experimented with providing library-agnostic attachment and removal hooks via a sneaky integration with HTML 5 custom elements API. They're not present in this version for simplicity, but if you need these callbacks please open an issue with your use case. We want to see if we can get along without them since they require quite a few gymnastics.

### API

#### Library Functions

#### Component Interface


[babel]: https://babeljs.io/
[dom-listener]: https://github.com/atom/dom-listener
