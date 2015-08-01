# etch

**Warning:** This library is work-in-progress and hasn't been used in production yet.

Etch is a minimal view library optimized for Electron and Atom package development. It combines HTML 5 custom elements, the `virtual-dom` library, and  model observation based on `Object.observe` into a minimal, easy-to-swallow package.

### Custom Elements + Virtual DOM

Etch custom elements define a `render` method, which returns a fragment of virtual DOM just like React components. The element's content will be updated based on the virtual DOM when it is attached to the document or when `.update()` is called on the element.

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
          this.tasks.map(task => {
            <li className='task' key={task.id}>
              <input type='checkbox' checked={task.completed}>
              task.description
            </li>
          })
        }</ol>
      </task-list>
    )
  }

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

import etch from 'etch'

// the `observe` function wraps `Object.obsere` and `Array.observe`, allowing
// you to directly express how pieces of your DOM tree map to the underlying
// data model:
let {observe} = etch;

etch.registerElement('task-list', {
  render () {
    return (
      <task-list>
        <h1>Tasks:</h1>
        <ol>{
          // Here we map over an *observation* of an array, which allows the
          // DOM to be updated whenever elements are added or removed.
          observe(this.tasks).map(task => {
            <li className='task'>
              // Observations can be passed as properties:
              <input type='checkbox' checked={observe(task, 'completed')}>
              // Observations can also be passed as text content:
              observe(task, 'description')
            </li>
          })
        }</ol>
      </task-list>
    )
  }

  initialize (tasks) {
    this.tasks = tasks
  }
})

let tasks = ['Write README', 'Build example']
let taskListElement = document.createElement('task-list')

// No need to trigger an update when the data changes. It happens automatically.
tasks.push({id: 3, description: 'Feed cats', completed: false})
tasks[1].completed = true
```

You can freely mix observation and diff-based updates.
