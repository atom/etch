import {EVENT_LISTENER_PROPS} from './event-listener-props'
import {SVG_TAGS} from './svg-tags'
import {HTML_TAGS} from './html-tags'

export interface EtchElement<T extends string, P = any> {
  tag: T
  props: P
  children: Array<string | number | object>
  ambiguous: Array<object>
}

export type EtchCreateElement<T extends string, P> = (props :P, ...children :Array<string | number | object>) => EtchElement<T, P>

export interface EtchDOM {
  <T extends string, P>(tag :T, props :P, ...children :Array<string | number | object>) :EtchElement<T, P>

  // auto-generated using dom_codegen.ts:
  a: EtchCreateElement<"a", any>
  abbr: EtchCreateElement<"abbr", any>
  article: EtchCreateElement<"article", any>
  address: EtchCreateElement<"address", any>
  aside: EtchCreateElement<"aside", any>
  audio: EtchCreateElement<"audio", any>
  b: EtchCreateElement<"b", any>
  bdi: EtchCreateElement<"bdi", any>
  bdo: EtchCreateElement<"bdo", any>
  blockquote: EtchCreateElement<"blockquote", any>
  body: EtchCreateElement<"body", any>
  button: EtchCreateElement<"button", any>
  canvas: EtchCreateElement<"canvas", any>
  caption: EtchCreateElement<"caption", any>
  cite: EtchCreateElement<"cite", any>
  code: EtchCreateElement<"code", any>
  colgroup: EtchCreateElement<"colgroup", any>
  datalist: EtchCreateElement<"datalist", any>
  dd: EtchCreateElement<"dd", any>
  del: EtchCreateElement<"del", any>
  details: EtchCreateElement<"details", any>
  dfn: EtchCreateElement<"dfn", any>
  dialog: EtchCreateElement<"dialog", any>
  div: EtchCreateElement<"div", any>
  dl: EtchCreateElement<"dl", any>
  dt: EtchCreateElement<"dt", any>
  em: EtchCreateElement<"em", any>
  fieldset: EtchCreateElement<"fieldset", any>
  figcaption: EtchCreateElement<"figcaption", any>
  figure: EtchCreateElement<"figure", any>
  footer: EtchCreateElement<"footer", any>
  form: EtchCreateElement<"form", any>
  h1: EtchCreateElement<"h1", any>
  h2: EtchCreateElement<"h2", any>
  h3: EtchCreateElement<"h3", any>
  h4: EtchCreateElement<"h4", any>
  h5: EtchCreateElement<"h5", any>
  h6: EtchCreateElement<"h6", any>
  head: EtchCreateElement<"head", any>
  header: EtchCreateElement<"header", any>
  html: EtchCreateElement<"html", any>
  i: EtchCreateElement<"i", any>
  ins: EtchCreateElement<"ins", any>
  iframe: EtchCreateElement<"iframe", any>
  kbd: EtchCreateElement<"kbd", any>
  label: EtchCreateElement<"label", any>
  legend: EtchCreateElement<"legend", any>
  li: EtchCreateElement<"li", any>
  main: EtchCreateElement<"main", any>
  map: EtchCreateElement<"map", any>
  mark: EtchCreateElement<"mark", any>
  menu: EtchCreateElement<"menu", any>
  meter: EtchCreateElement<"meter", any>
  nav: EtchCreateElement<"nav", any>
  noscript: EtchCreateElement<"noscript", any>
  object: EtchCreateElement<"object", any>
  ol: EtchCreateElement<"ol", any>
  optgroup: EtchCreateElement<"optgroup", any>
  option: EtchCreateElement<"option", any>
  output: EtchCreateElement<"output", any>
  p: EtchCreateElement<"p", any>
  pre: EtchCreateElement<"pre", any>
  progress: EtchCreateElement<"progress", any>
  q: EtchCreateElement<"q", any>
  rp: EtchCreateElement<"rp", any>
  rt: EtchCreateElement<"rt", any>
  ruby: EtchCreateElement<"ruby", any>
  s: EtchCreateElement<"s", any>
  samp: EtchCreateElement<"samp", any>
  script: EtchCreateElement<"script", any>
  section: EtchCreateElement<"section", any>
  select: EtchCreateElement<"select", any>
  small: EtchCreateElement<"small", any>
  span: EtchCreateElement<"span", any>
  strong: EtchCreateElement<"strong", any>
  sub: EtchCreateElement<"sub", any>
  style: EtchCreateElement<"style", any>
  summary: EtchCreateElement<"summary", any>
  sup: EtchCreateElement<"sup", any>
  table: EtchCreateElement<"table", any>
  tbody: EtchCreateElement<"tbody", any>
  td: EtchCreateElement<"td", any>
  textarea: EtchCreateElement<"textarea", any>
  tfoot: EtchCreateElement<"tfoot", any>
  th: EtchCreateElement<"th", any>
  thead: EtchCreateElement<"thead", any>
  time: EtchCreateElement<"time", any>
  title: EtchCreateElement<"title", any>
  tr: EtchCreateElement<"tr", any>
  u: EtchCreateElement<"u", any>
  ul: EtchCreateElement<"ul", any>
  var: EtchCreateElement<"var", any>
  video: EtchCreateElement<"video", any>
  area: EtchCreateElement<"area", any>
  base: EtchCreateElement<"base", any>
  br: EtchCreateElement<"br", any>
  col: EtchCreateElement<"col", any>
  command: EtchCreateElement<"command", any>
  embed: EtchCreateElement<"embed", any>
  hr: EtchCreateElement<"hr", any>
  img: EtchCreateElement<"img", any>
  input: EtchCreateElement<"input", any>
  keygen: EtchCreateElement<"keygen", any>
  link: EtchCreateElement<"link", any>
  meta: EtchCreateElement<"meta", any>
  param: EtchCreateElement<"param", any>
  source: EtchCreateElement<"source", any>
  track: EtchCreateElement<"track", any>
  wbr: EtchCreateElement<"wbr", any>
  circle: EtchCreateElement<"circle", any>
  clipPath: EtchCreateElement<"clipPath", any>
  defs: EtchCreateElement<"defs", any>
  ellipse: EtchCreateElement<"ellipse", any>
  g: EtchCreateElement<"g", any>
  image: EtchCreateElement<"image", any>
  line: EtchCreateElement<"line", any>
  linearGradient: EtchCreateElement<"linearGradient", any>
  mask: EtchCreateElement<"mask", any>
  path: EtchCreateElement<"path", any>
  pattern: EtchCreateElement<"pattern", any>
  polygon: EtchCreateElement<"polygon", any>
  polyline: EtchCreateElement<"polyline", any>
  radialGradient: EtchCreateElement<"radialGradient", any>
  rect: EtchCreateElement<"rect", any>
  stop: EtchCreateElement<"stop", any>
  svg: EtchCreateElement<"svg", any>
  text: EtchCreateElement<"text", any>
  tspan: EtchCreateElement<"tspan", any>
}


export function dom<T extends string, P>(tag :T extends string, props :P, ...children :Array<string | number | object>) :EtchElement<T, P> {

  let ambiguous :Array<object> = []

  for (let i = 0; i < children.length;) {
    const child = children[i]
    switch (typeof child) {
      case 'string':
      case 'number':
        children[i] = {text: child}
        i++
        break;

      case 'object':
        if (Array.isArray(child)) {
          children.splice(i, 1, ...child)
        } else if (!child) {
          children.splice(i, 1)
        } else {
          if (!child.context) {
            ambiguous.push(child)
            if (child.ambiguous && child.ambiguous.length) {
              ambiguous = ambiguous.concat(child.ambiguous)
            }
          }
          i++
        }
        break;

      default:
        throw new Error(`Invalid child node: ${child}`)
    }
  }

  if (props) {
    for (const propName in props) {
      const eventName :string = (EVENT_LISTENER_PROPS as any)[propName]
      if (eventName) {
        if (!props.on) props.on = {}
        props.on[eventName] = props[propName]
      }
    }

    if (props.class) {
      props.className = props.class
    }
  }

  return {tag, props, children, ambiguous}
}

export declare const dom :EtchDOM

for (const tagName of HTML_TAGS) {
  dom[tagName] = function <tagName, P>(props :P, ...children :Array<string | number | object>) :EtchElement<tagName, P> {
    return dom(tagName, props, ...children)
  }
}

for (const tagName of SVG_TAGS) {
  dom[tagName] = function <tagName, P>(props :P, ...children :Array<string | number | object>) :EtchElement<tagName, P> {
    return dom(tagName, props, ...children)
  }
}
