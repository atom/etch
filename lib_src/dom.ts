import {EVENT_LISTENER_PROPS} from './event-listener-props'
import {SVG_TAGS} from './svg-tags'
import {HTML_TAGS} from './html-tags'

declare interface ChildObject {
  text: string | number,
  ambiguous?: Array<object>,
  context?: any
}

export interface EtchElement<T extends string, P = any> {
  tag: T
  props: P
  children: Array<string | number | ChildObject>
  ambiguous: Array<object>
}

export type EtchCreateElement<T extends string, P> = (props :P, ...children :Array<string | number | ChildObject>) => EtchElement<T, P>

declare global {
  export namespace JSX {
    export interface Element extends EtchElement<any, any> {}
    export interface IntrinsicElements {

      // constraint on props of each element
      // auto-generated using dom_codegen.ts:
      a: any
      abbr: any
      address: any
      aside: any
      article: any
      audio: any
      b: any
      bdi: any
      bdo: any
      blockquote: any
      body: any
      button: any
      caption: any
      canvas: any
      code: any
      cite: any
      colgroup: any
      datalist: any
      del: any
      dd: any
      details: any
      dialog: any
      div: any
      dfn: any
      dt: any
      dl: any
      em: any
      fieldset: any
      figcaption: any
      figure: any
      footer: any
      form: any
      h1: any
      h3: any
      h4: any
      h2: any
      h5: any
      h6: any
      header: any
      head: any
      html: any
      i: any
      iframe: any
      kbd: any
      label: any
      ins: any
      legend: any
      main: any
      li: any
      mark: any
      meter: any
      map: any
      menu: any
      object: any
      nav: any
      ol: any
      noscript: any
      optgroup: any
      option: any
      pre: any
      output: any
      p: any
      q: any
      progress: any
      ruby: any
      s: any
      rt: any
      samp: any
      script: any
      section: any
      small: any
      select: any
      strong: any
      style: any
      rp: any
      summary: any
      sup: any
      table: any
      sub: any
      tbody: any
      textarea: any
      span: any
      td: any
      tfoot: any
      title: any
      time: any
      th: any
      thead: any
      u: any
      tr: any
      ul: any
      var: any
      video: any
      area: any
      br: any
      base: any
      command: any
      img: any
      hr: any
      col: any
      input: any
      embed: any
      keygen: any
      link: any
      meta: any
      source: any
      wbr: any
      circle: any
      clipPath: any
      param: any
      defs: any
      ellipse: any
      g: any
      line: any
      image: any
      linearGradient: any
      mask: any
      path: any
      track: any
      pattern: any
      polygon: any
      polyline: any
      rect: any
      radialGradient: any
      svg: any
      text: any
      tspan: any
      stop: any
    }
  }
}

export interface EtchDOM {
  <T extends string, P>(tag :T, props :P, ...children :Array<string | number | object>) :EtchElement<T, P>

  // auto-generated using dom_codegen.ts:
  address: EtchCreateElement<"address", JSX.IntrinsicElements["address"]>
  a: EtchCreateElement<"a", JSX.IntrinsicElements["a"]>
  abbr: EtchCreateElement<"abbr", JSX.IntrinsicElements["abbr"]>
  article: EtchCreateElement<"article", JSX.IntrinsicElements["article"]>
  aside: EtchCreateElement<"aside", JSX.IntrinsicElements["aside"]>
  audio: EtchCreateElement<"audio", JSX.IntrinsicElements["audio"]>
  b: EtchCreateElement<"b", JSX.IntrinsicElements["b"]>
  bdi: EtchCreateElement<"bdi", JSX.IntrinsicElements["bdi"]>
  blockquote: EtchCreateElement<"blockquote", JSX.IntrinsicElements["blockquote"]>
  body: EtchCreateElement<"body", JSX.IntrinsicElements["body"]>
  bdo: EtchCreateElement<"bdo", JSX.IntrinsicElements["bdo"]>
  button: EtchCreateElement<"button", JSX.IntrinsicElements["button"]>
  caption: EtchCreateElement<"caption", JSX.IntrinsicElements["caption"]>
  canvas: EtchCreateElement<"canvas", JSX.IntrinsicElements["canvas"]>
  cite: EtchCreateElement<"cite", JSX.IntrinsicElements["cite"]>
  code: EtchCreateElement<"code", JSX.IntrinsicElements["code"]>
  colgroup: EtchCreateElement<"colgroup", JSX.IntrinsicElements["colgroup"]>
  datalist: EtchCreateElement<"datalist", JSX.IntrinsicElements["datalist"]>
  dd: EtchCreateElement<"dd", JSX.IntrinsicElements["dd"]>
  del: EtchCreateElement<"del", JSX.IntrinsicElements["del"]>
  details: EtchCreateElement<"details", JSX.IntrinsicElements["details"]>
  dialog: EtchCreateElement<"dialog", JSX.IntrinsicElements["dialog"]>
  dfn: EtchCreateElement<"dfn", JSX.IntrinsicElements["dfn"]>
  div: EtchCreateElement<"div", JSX.IntrinsicElements["div"]>
  dl: EtchCreateElement<"dl", JSX.IntrinsicElements["dl"]>
  dt: EtchCreateElement<"dt", JSX.IntrinsicElements["dt"]>
  em: EtchCreateElement<"em", JSX.IntrinsicElements["em"]>
  figcaption: EtchCreateElement<"figcaption", JSX.IntrinsicElements["figcaption"]>
  fieldset: EtchCreateElement<"fieldset", JSX.IntrinsicElements["fieldset"]>
  figure: EtchCreateElement<"figure", JSX.IntrinsicElements["figure"]>
  form: EtchCreateElement<"form", JSX.IntrinsicElements["form"]>
  footer: EtchCreateElement<"footer", JSX.IntrinsicElements["footer"]>
  h1: EtchCreateElement<"h1", JSX.IntrinsicElements["h1"]>
  h2: EtchCreateElement<"h2", JSX.IntrinsicElements["h2"]>
  h3: EtchCreateElement<"h3", JSX.IntrinsicElements["h3"]>
  h4: EtchCreateElement<"h4", JSX.IntrinsicElements["h4"]>
  h5: EtchCreateElement<"h5", JSX.IntrinsicElements["h5"]>
  h6: EtchCreateElement<"h6", JSX.IntrinsicElements["h6"]>
  head: EtchCreateElement<"head", JSX.IntrinsicElements["head"]>
  header: EtchCreateElement<"header", JSX.IntrinsicElements["header"]>
  html: EtchCreateElement<"html", JSX.IntrinsicElements["html"]>
  i: EtchCreateElement<"i", JSX.IntrinsicElements["i"]>
  iframe: EtchCreateElement<"iframe", JSX.IntrinsicElements["iframe"]>
  ins: EtchCreateElement<"ins", JSX.IntrinsicElements["ins"]>
  kbd: EtchCreateElement<"kbd", JSX.IntrinsicElements["kbd"]>
  label: EtchCreateElement<"label", JSX.IntrinsicElements["label"]>
  legend: EtchCreateElement<"legend", JSX.IntrinsicElements["legend"]>
  main: EtchCreateElement<"main", JSX.IntrinsicElements["main"]>
  li: EtchCreateElement<"li", JSX.IntrinsicElements["li"]>
  map: EtchCreateElement<"map", JSX.IntrinsicElements["map"]>
  mark: EtchCreateElement<"mark", JSX.IntrinsicElements["mark"]>
  menu: EtchCreateElement<"menu", JSX.IntrinsicElements["menu"]>
  meter: EtchCreateElement<"meter", JSX.IntrinsicElements["meter"]>
  nav: EtchCreateElement<"nav", JSX.IntrinsicElements["nav"]>
  noscript: EtchCreateElement<"noscript", JSX.IntrinsicElements["noscript"]>
  object: EtchCreateElement<"object", JSX.IntrinsicElements["object"]>
  ol: EtchCreateElement<"ol", JSX.IntrinsicElements["ol"]>
  optgroup: EtchCreateElement<"optgroup", JSX.IntrinsicElements["optgroup"]>
  option: EtchCreateElement<"option", JSX.IntrinsicElements["option"]>
  output: EtchCreateElement<"output", JSX.IntrinsicElements["output"]>
  pre: EtchCreateElement<"pre", JSX.IntrinsicElements["pre"]>
  p: EtchCreateElement<"p", JSX.IntrinsicElements["p"]>
  progress: EtchCreateElement<"progress", JSX.IntrinsicElements["progress"]>
  q: EtchCreateElement<"q", JSX.IntrinsicElements["q"]>
  rp: EtchCreateElement<"rp", JSX.IntrinsicElements["rp"]>
  rt: EtchCreateElement<"rt", JSX.IntrinsicElements["rt"]>
  ruby: EtchCreateElement<"ruby", JSX.IntrinsicElements["ruby"]>
  s: EtchCreateElement<"s", JSX.IntrinsicElements["s"]>
  samp: EtchCreateElement<"samp", JSX.IntrinsicElements["samp"]>
  script: EtchCreateElement<"script", JSX.IntrinsicElements["script"]>
  section: EtchCreateElement<"section", JSX.IntrinsicElements["section"]>
  select: EtchCreateElement<"select", JSX.IntrinsicElements["select"]>
  small: EtchCreateElement<"small", JSX.IntrinsicElements["small"]>
  strong: EtchCreateElement<"strong", JSX.IntrinsicElements["strong"]>
  span: EtchCreateElement<"span", JSX.IntrinsicElements["span"]>
  style: EtchCreateElement<"style", JSX.IntrinsicElements["style"]>
  sub: EtchCreateElement<"sub", JSX.IntrinsicElements["sub"]>
  summary: EtchCreateElement<"summary", JSX.IntrinsicElements["summary"]>
  sup: EtchCreateElement<"sup", JSX.IntrinsicElements["sup"]>
  table: EtchCreateElement<"table", JSX.IntrinsicElements["table"]>
  tbody: EtchCreateElement<"tbody", JSX.IntrinsicElements["tbody"]>
  td: EtchCreateElement<"td", JSX.IntrinsicElements["td"]>
  textarea: EtchCreateElement<"textarea", JSX.IntrinsicElements["textarea"]>
  tfoot: EtchCreateElement<"tfoot", JSX.IntrinsicElements["tfoot"]>
  th: EtchCreateElement<"th", JSX.IntrinsicElements["th"]>
  thead: EtchCreateElement<"thead", JSX.IntrinsicElements["thead"]>
  time: EtchCreateElement<"time", JSX.IntrinsicElements["time"]>
  title: EtchCreateElement<"title", JSX.IntrinsicElements["title"]>
  tr: EtchCreateElement<"tr", JSX.IntrinsicElements["tr"]>
  ul: EtchCreateElement<"ul", JSX.IntrinsicElements["ul"]>
  u: EtchCreateElement<"u", JSX.IntrinsicElements["u"]>
  var: EtchCreateElement<"var", JSX.IntrinsicElements["var"]>
  video: EtchCreateElement<"video", JSX.IntrinsicElements["video"]>
  area: EtchCreateElement<"area", JSX.IntrinsicElements["area"]>
  base: EtchCreateElement<"base", JSX.IntrinsicElements["base"]>
  br: EtchCreateElement<"br", JSX.IntrinsicElements["br"]>
  col: EtchCreateElement<"col", JSX.IntrinsicElements["col"]>
  command: EtchCreateElement<"command", JSX.IntrinsicElements["command"]>
  embed: EtchCreateElement<"embed", JSX.IntrinsicElements["embed"]>
  hr: EtchCreateElement<"hr", JSX.IntrinsicElements["hr"]>
  img: EtchCreateElement<"img", JSX.IntrinsicElements["img"]>
  input: EtchCreateElement<"input", JSX.IntrinsicElements["input"]>
  keygen: EtchCreateElement<"keygen", JSX.IntrinsicElements["keygen"]>
  link: EtchCreateElement<"link", JSX.IntrinsicElements["link"]>
  meta: EtchCreateElement<"meta", JSX.IntrinsicElements["meta"]>
  param: EtchCreateElement<"param", JSX.IntrinsicElements["param"]>
  source: EtchCreateElement<"source", JSX.IntrinsicElements["source"]>
  track: EtchCreateElement<"track", JSX.IntrinsicElements["track"]>
  wbr: EtchCreateElement<"wbr", JSX.IntrinsicElements["wbr"]>
  circle: EtchCreateElement<"circle", JSX.IntrinsicElements["circle"]>
  clipPath: EtchCreateElement<"clipPath", JSX.IntrinsicElements["clipPath"]>
  defs: EtchCreateElement<"defs", JSX.IntrinsicElements["defs"]>
  ellipse: EtchCreateElement<"ellipse", JSX.IntrinsicElements["ellipse"]>
  g: EtchCreateElement<"g", JSX.IntrinsicElements["g"]>
  image: EtchCreateElement<"image", JSX.IntrinsicElements["image"]>
  line: EtchCreateElement<"line", JSX.IntrinsicElements["line"]>
  linearGradient: EtchCreateElement<"linearGradient", JSX.IntrinsicElements["linearGradient"]>
  mask: EtchCreateElement<"mask", JSX.IntrinsicElements["mask"]>
  path: EtchCreateElement<"path", JSX.IntrinsicElements["path"]>
  pattern: EtchCreateElement<"pattern", JSX.IntrinsicElements["pattern"]>
  polygon: EtchCreateElement<"polygon", JSX.IntrinsicElements["polygon"]>
  polyline: EtchCreateElement<"polyline", JSX.IntrinsicElements["polyline"]>
  radialGradient: EtchCreateElement<"radialGradient", JSX.IntrinsicElements["radialGradient"]>
  rect: EtchCreateElement<"rect", JSX.IntrinsicElements["rect"]>
  stop: EtchCreateElement<"stop", JSX.IntrinsicElements["stop"]>
  svg: EtchCreateElement<"svg", JSX.IntrinsicElements["svg"]>
  text: EtchCreateElement<"text", JSX.IntrinsicElements["text"]>
  tspan: EtchCreateElement<"tspan", JSX.IntrinsicElements["tspan"]>
}



export function dom<T extends string, P>(tag :T, props :P, ...children :Array<string | number | ChildObject>) :EtchElement<T, P> {

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
  dom[tagName] = function <tagName extends string, P>(props :P, ...children :Array<string | number | ChildObject>) :EtchElement<tagName, P> {
    return dom(tagName, props, ...children)
  }
}

for (const tagName of SVG_TAGS) {
  dom[tagName] = function <tagName extends string, P>(props :P, ...children :Array<string | number | ChildObject>) :EtchElement<tagName, P> {
    return dom(tagName, props, ...children)
  }
}
