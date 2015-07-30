export default function getSetImmediatePromise () {
  return new Promise(resolve => global.setImmediate(resolve))
}
