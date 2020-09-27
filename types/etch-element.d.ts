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
