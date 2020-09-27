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

