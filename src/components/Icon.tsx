export const Icon = (props: { name: string; onClick?: () => any; title?: string }) => {
  return (
    <div
      class={`w-5 h-5 hover:op60 hover:cursor-pointer ${props.name}`}
      onClick={props.onClick}
      title={props.title}
    ></div>
  )
}
