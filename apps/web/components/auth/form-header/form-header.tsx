import { FormHeaderIcon } from "./form-header-icon"
import { FormHeaderTitle } from "./form-header-title"
import { FormHeaderHelperText } from "./form-header-helper-text"

export async function FormHeader({
  type = "email"
}: {
  type: "email" | "phone"
}) {

  return (
    <div className="
      flex
      flex-row
      items-start
      gap-4
    ">
      <FormHeaderIcon type={type} />

      <div className="
        flex
        flex-col
        gap-2
      ">
        <FormHeaderTitle type={type} />
        <FormHeaderHelperText type={type} />
      </div>

    </div>
  )
}