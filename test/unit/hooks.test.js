/** @jsx dom */

const {assert} = require('chai')
const HOOKS = require('../../lib/hooks')

describe('hooks ()', function () {
  describe('isHook', function () {
    const testCases = [
      { title: 'string', value: 'hello world', expected: false },
      { title: 'number', value: 42, expected: false },
      { title: 'boolean', value: true, expected: false },
      { title: 'undefined', value: undefined, expected: false },
      { title: 'null', value: null, expected: false },
      { title: 'function', value: function () {}, expected: false },
      { title: 'array', value: [], expected: false },
      { title: 'object', value: {}, expected: false },
      { title: 'object with hook', value: { hook () {} }, expected: true },
      { title: 'object with unhook', value: { unhook () {} }, expected: true }
    ]

    testCases.forEach(function ({ title, value, expected }) {
      it(title, function () {
        assert.equal(
          HOOKS.isHook(value),
          expected,
          'Expected ' + title + (!expected ? ' not' : '') + ' to be a hook'
        )
      })
    })
  })

  describe('setHooks ()', function () {
    it('sets hooks for `input` tag and `value` prop', function () {
      const tag = 'input'
      const props = { value: 'new value' }

      HOOKS.setHooks(tag, props)

      assert.typeOf(props.value.hook, 'function')
      assert.equal(props.value.newValue, 'new value')
    })

    it('ignores hooks on components', function () {
      const tag = { render () {}, update () {} }
      const props = { value: 'new value' }

      HOOKS.setHooks(tag, props)

      assert.equal(props.value, 'new value')
    })
  })
})
