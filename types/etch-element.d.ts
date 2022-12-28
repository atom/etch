/** Etch class props */
type Props = object

/** Etch element extra props */
interface EtchExtraProps {
  ref?: string
  className?: string
  on?: {
    click?: (e: MouseEvent) => any
    [name: string]: ((e: any) => any) | undefined
  }
  dataset?: {
    [propName: string]: string | number | null
  }
  innerHTML?: string
  innerText?: string
  key?: any
}

/** Etch HTML element */
export interface EtchHTMLElement<Tag extends keyof HTMLElementTagNameMap> {
  tag: Tag
  props: HTMLElementTagNameMap[Tag] & EtchExtraProps & Props
  children: ChildSpec
  ambiguous: Array<object>
}

/** Etch SVG element */
export interface EtchSVGElement<Tag extends keyof SVGElementTagNameMap> {
  tag: Tag
  props: SVGElementTagNameMap[Tag] & EtchExtraProps & Props
  children?: ChildSpec
  ambiguous: Array<object>
}


/** Etch element's tag */
type TagSpec = string | ElementClassConstructor<JSX.ElementClass> | keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap

/** General Etch element */
export interface EtchElement<Tag extends TagSpec> {
  tag: Tag
  props: EtchExtraProps & Props
  children?: ChildSpec
  ambiguous: Array<object>
}

/** Etch JSX Element */
type EtchJSXElement =
  | EtchHTMLElement<keyof HTMLElementTagNameMap>
  | EtchSVGElement<keyof SVGElementTagNameMap>
  | EtchElement<TagSpec>
  | {text: string | number}

type SingleOrArray<T> = T | T[]
/** type of etch elements' children */
type ChildSpec = SingleOrArray<string | number | EtchJSXElement | null>


type ElementClassConstructor<T extends JSX.ElementClass> = new (props: T["props"], children: EtchJSXElement[]) => T

export declare namespace JSX {
  type Element = EtchJSXElement
  type IntrinsicElements = EtchJSXElement
  class ElementClass {
    public props: Props
    constructor(props: Props, children?: EtchJSXElement[])
    public render?(): EtchJSXElement
    public update(props: Props, children?: EtchJSXElement[]): Promise<void>
  }
  interface ElementAttributesProperty {
    props: Props // specify the property name to use
  }
}
