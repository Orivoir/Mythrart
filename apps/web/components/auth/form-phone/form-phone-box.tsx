"use client"

import type { SyntheticEvent } from "react"
import "react-phone-number-input/style.css"
import { FormPhoneSubmit } from "./form-phone-submit"
import { FormPhoneInput } from "./form-phone-input"

export function FormPhoneBox() {

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const phone = formData.get("phone")

    console.log("Submitted auth phone:", phone)
  }

  return (
    <form className="mt-4" onSubmit={handleSubmit}>

      <FormPhoneInput />
      <FormPhoneSubmit />
    </form>
  )
}