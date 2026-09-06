export default function Active({visible}: {visible: boolean}) {

  if (!visible) return null

  return (
    <span
      aria-hidden="true"
      className="
        absolute
        bottom-0
        left-1/2
        h-0.5
        w-8
        -translate-x-1/2
        rounded-full
        bg-primary
      "
    />
  )
}