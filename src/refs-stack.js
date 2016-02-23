// This stack is shared by `initialize`, `performElementUpdate`,
// `ComponentWidget`, and `RefHook`. The top of the stack will always contain
// the `refs` object of the component that is currently being created or
// updated, enabling widgets and hooks to create references to DOM nodes
// that are associated with `ref` properties.
export default []
