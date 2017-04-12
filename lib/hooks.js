// Contains a list of well known hooks for certain tags and properties
const HOOKS = {
  'input': {
    'value': softSetHook
  }
}

// softSetHook is used to update the property value on the given
// dom node only if the new value differs from the dom node value
// E.g. setting the `value` of an `input` to the same value
// resets the cursor position to the end
function softSetHook (newValue) {
  return {
    newValue,
    hook (domNode, name, oldValue) {
      if (domNode[name] !== newValue) {
        domNode[name] = newValue
      }
    }
  }
}

// ishook returns whether the given value is a hook
function isHook (hook) {
  return !!(hook && (typeof hook.hook === 'function' || typeof hook.unhook === 'function'))
}

// setHooks applies well known hooks onto certain props of certain tags
function setHooks (tag, props) {
  const hooks = typeof tag === 'string' ? HOOKS[tag.toLowerCase()] : null
  if (!hooks) {
    return
  }

  Object.keys(hooks).forEach((name) => {
    if (!props.hasOwnProperty(name)) {
      return
    }
    const value = props[name]
    if (value !== undefined && !isHook(value)) {
      props[name] = hooks[name](value)
    }
  })
}

module.exports = {
  isHook,
  setHooks
}
