import { FormHeader } from "./form-header/form-header"
import { FormEmailBox } from "./form-email/form-email-box"
import { FormPhoneBox } from "./form-phone/form-phone-box"
import {cn} from "@/lib/utils"

export function FormBox({
  type = "email"
}: {
  type: "email" | "phone"
}) {

  return (
    <div className={cn(
      "mt-8",
      "border-solid",
      type === "email" ? "border-2": "border",
      "rounded-md",
      "py-4",
      "px-6",
      type === "email" ? "border-accent/40": "border-muted/25"
    )}>
      <FormHeader type={type} />
      
      {type === "phone" ?
        <FormPhoneBox />:
        <FormEmailBox />
      }
    </div>
  )
}