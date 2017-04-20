// Turns an object into a string of styles.
//
// `stylesObject` is an object with keys matching the css names either
// camel-cased or as style names (fontSize or font-size).
module.exports = function(stylesObject){
  let styles = []
  let keys = Object.keys(stylesObject)

  for(let i = 0; i < keys.length; i++){
    let attribute = hyphenateName(keys[i])

    styles.push(
      attribute
      + ': '
      + ensureUnit(attribute, stylesObject[keys[i]])
      + ';'
    )
  }

  return styles.join(' ')
}

// Turns a camel-cased name into a hyphenated name
//
// fontSize becomes font-size
function hyphenateName(keyName){
  return keyName.replace(/[A-Z]/, '-$&').toLowerCase()
}

// Turns a number in a `px` value if needed.
//
// Takes the `attribute` that this value is for and the `value`.
function ensureUnit(attribute, value){
  if(NO_UNIT_TAGS.indexOf(attribute) != -1 || !(typeof value === 'number')){
    return value
  }else{
    return value + 'px'
  }
}

// List of css properties that do no need units on numbers.
const NO_UNIT_TAGS = [
  'animation-iteration-count', 'box-flex', 'box-flex-group',
  'box-ordinal-group', 'column-count', 'fill-opacity', 'flex', 'flex-grow',
  'flex-positive', 'flex-shrink', 'flex-negative', 'flexoOrder', 'grid-row',
  'grid-column', 'font-weight', 'line-clamp', 'line-height', 'opacity', 'order',
  'orphans', 'stop-opacity', 'stroke-dashoffset', 'stroke-opacity',
  'stroke-width', 'tab-size', 'widows', 'z-index', 'zoom'
]
