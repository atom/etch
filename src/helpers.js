export function isScalarObservation(object) {
  return object &&
    typeof object.getValue === 'function' &&
    typeof object.onDidChangeValue === 'function';
}

export function isArrayObservation(object) {
  return object &&
    typeof object.getValues === 'function' &&
    typeof object.onDidChangeValues === 'function';
}
