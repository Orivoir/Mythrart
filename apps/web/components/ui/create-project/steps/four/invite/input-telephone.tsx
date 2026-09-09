"use client"

import { Phone, Send } from "lucide-react"
import { useState } from "react"
import PhoneInput from "react-phone-number-input/input"
import type { CountryCode } from "libphonenumber-js"
import { getCountryCallingCode } from "react-phone-number-input"
import getUnicodeFlagIcon from "country-flag-icons/unicode"
import { Select } from "@radix-ui/themes"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"

import type {
  CollaboratorRole,
  SupportedCountry,
} from "../types"

interface InputTelephoneProps {
  value: string
  country: CountryCode
  role: CollaboratorRole["id"]
  roles: CollaboratorRole[]
  countries: SupportedCountry[]
  onChange: (value: string) => void
  onCountryChange: (country: CountryCode) => void
  onRoleChange: (role: CollaboratorRole["id"]) => void
  onSubmit: () => void
}

export function InputTelephone({
  value,
  country,
  role,
  roles,
  countries,
  onChange,
  onCountryChange,
  onRoleChange,
  onSubmit,
}: InputTelephoneProps) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px_auto]">
      <div className="space-y-2">
        <label
          htmlFor="collaborator-phone"
          className="text-sm font-medium text-foreground"
        >
          Numéro de téléphone
        </label>

        <div
          className="
            flex h-11 items-center rounded
            border border-border bg-background
            transition-colors
            focus-within:border-accent
            focus-within:ring-2
            focus-within:ring-accent/20
          "
        >
          <Select.Root
            value={country}
            onValueChange={(value) =>
              onCountryChange(value as CountryCode)
            }
          >
            <Select.Trigger
              variant="ghost"
              className="
                h-full shrink-0 border-0
                px-3
                text-sm
              "
              aria-label="Pays"
            >
              <span className="text-lg leading-none">
                {getUnicodeFlagIcon(country)}
              </span>

              <span className="text-muted-foreground">
                +{getCountryCallingCode(country)}
              </span>
            </Select.Trigger>

            <Select.Content position="popper" variant="solid" className="z-50 bg-surface p-2">
              {countries.map((item) => (
                <Select.Item
                  key={item.code}
                  value={item.code}
                >
                  <span className="mr-2">
                    {getUnicodeFlagIcon(item.code)}
                  </span>

                  {item.label}{" "}
                  <span className="text-muted-foreground">
                    +{getCountryCallingCode(item.code)}
                  </span>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <PhoneInput
            id="collaborator-phone"
            country={country}
            value={value}
            onChange={(nextValue) =>
              onChange(nextValue ?? "")
            }
            placeholder="06 12 34 56 78"
            className="
              min-w-0 flex-1
              bg-transparent
              px-2
              text-sm text-foreground
              outline-none
              placeholder:text-muted-foreground
            "
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="collaborator-phone-role"
          className="text-sm font-medium text-foreground"
        >
          Rôle
        </label>

        <select
          id="collaborator-phone-role"
          value={role}
          onChange={(event) =>
            onRoleChange(
              event.target.value as CollaboratorRole["id"],
            )
          }
          className="
            h-11 w-full rounded border border-border
            bg-background px-3 text-sm text-foreground
            outline-none
            focus:border-accent
            focus:ring-2 focus:ring-accent/20
          "
        >
          {roles.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <ButtonWithIcon
          type="button"
          variant="primary"
          icon={Send}
          onClick={onSubmit}
          disabled={!value.trim()}
          className="w-full md:w-auto"
        >
          Envoyer l'invitation
        </ButtonWithIcon>
      </div>
    </div>
  )
}