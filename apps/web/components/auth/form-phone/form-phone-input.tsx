"use client"

import PhoneInput from "react-phone-number-input"
import type { Country, Value } from "react-phone-number-input"
import { isSupportedCountry } from "react-phone-number-input"
import { useState } from "react"
import "react-phone-number-input/style.css"
import {useLocale} from "next-intl"
import FormPhoneCustomInput from "../custom-components-phone/form-phone-custom-input"
import { CountrySelect } from "../custom-components-phone/country-select"
import { PhoneFlag } from "../custom-components-phone/phone-flag-select"

export function FormPhoneInput() {

  const [value, setValue] = useState<Value | undefined>()
  const locale = useLocale()

  const localeRegion = locale.split("-")[1]?.toUpperCase()
  const localeLanguage = locale.split("-")[0]?.toLowerCase()

  const defaultCountry = (
    localeRegion && isSupportedCountry(localeRegion)
      ? localeRegion
      : localeLanguage === "fr"
      ? "FR"
      : "US"
  ) as Country

  return (
    <PhoneInput
      defaultCountry={defaultCountry}
      name="phone"
      countrySelectComponent={CountrySelect}
      flagComponent={PhoneFlag}
      value={value}
      onChange={(newValue) => {
        setValue(newValue)
      }}
      inputComponent={FormPhoneCustomInput}
      className="PhoneInputCustom"
      smartCaret
    />
  )
}