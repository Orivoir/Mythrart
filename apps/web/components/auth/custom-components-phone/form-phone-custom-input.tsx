import {forwardRef} from "react"

import { cn } from "@/lib/utils"

type FormPhoneInputProps = React.InputHTMLAttributes<HTMLInputElement>

function FormPhoneCustomInput(
  { className, ...props }: FormPhoneInputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {

  return (
    <input
      ref={ref}
      {...props}
      type="tel"
      className={cn(
        "w-full",
        "h-11",
        "rounded-md",
        "border-solid",
        "border",
        "border-muted/20",
        "px-4",
        "py-2",
        "outline-0",
        "outline-transparent",
        "outline-offset-10",
        "focus:border-accent/40",
        className,
      )}
    />
  )
}

export default forwardRef(FormPhoneCustomInput)
