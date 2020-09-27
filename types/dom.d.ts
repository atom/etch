import {JSX, EtchJSXElement, EtchExtraProps, Props, ChildSpec, TagSpec, ElementClassConstructor} from "./etch-element"

export function dom<T extends keyof HTMLElementTagNameMap>(tag: T, props?: HTMLElementTagNameMap[T] & EtchExtraProps & Props, ...children: ChildSpec[]): EtchJSXElement
export function dom<T extends keyof SVGElementTagNameMap>(tag: T, props?: SVGElementTagNameMap[T] & EtchExtraProps & Props, ...children: ChildSpec[]): EtchJSXElement
export function dom<T extends JSX.ElementClass>( tag: ElementClassConstructor<T>, props: T["props"],...children: ChildSpec[]): EtchJSXElement
export function dom(tag: string, props?: EtchExtraProps & Props, ...children: ChildSpec[]): EtchJSXElement
