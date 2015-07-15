export function isScalarObservation(object) {
  return object &&
    typeof object.getValue === 'function' &&
    typeof object.onDidChangeValue === 'function';
}
