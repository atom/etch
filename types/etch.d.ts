export * from "./etch-element"
export * from "./dom"
import {EtchJSXElement} from "./etch-element"

export function destroy(component: any, removeNode?: boolean): Promise<void>
export function destroySync(component: any, removeNode: any): void
export function getScheduler(): any
export function initialize(component: any): void
export function render(virtualNode: EtchJSXElement, options?: any): Node
export function setScheduler(customScheduler: any): void
export function update(component: any, replaceNode?: boolean): Promise<void>
export function updateSync(component: any, replaceNode?: boolean): void
