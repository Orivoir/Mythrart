"use client"

import { Mail, Phone } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

import type {
  CollaboratorRole,
  InviteMethod,
  InviteValues,
  SupportedCountry,
} from "../types"

import { InputEmail } from "./input-email"
import { InputTelephone } from "./input-telephone"

import {useTranslations} from "next-intl"

interface InviteProps {
  roles: CollaboratorRole[]
  countries: SupportedCountry[]
  initialValues?: Partial<InviteValues>
  onInvite?: (
    method: InviteMethod,
    values: InviteValues,
  ) => void
}

export function Invite({
  roles,
  countries,
  initialValues,
  onInvite,
}: InviteProps) {
  const [method, setMethod] =
    useState<InviteMethod>("email")

  const [email, setEmail] = useState(
    initialValues?.email ?? "",
  )

  const [phone, setPhone] = useState(
    initialValues?.phone ?? "",
  )

  const [country, setCountry] =
    useState<SupportedCountry["code"]>(
      initialValues?.country ??
        countries[0]?.code ??
        "FR",
    )

  const [role, setRole] = useState<
    CollaboratorRole["id"]
  >(
    initialValues?.role ??
      roles[0]?.id ??
      "reader",
  )

  function handleSubmit() {
    onInvite?.(method, {
      email,
      phone,
      country,
      role,
    })
  }

  const t = useTranslations('CreateProject.StepFour.Invite')

  return (
    <section
      className="
        rounded-lg border border-border
        bg-background p-4 sm:p-5
      "
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t('Title')}
        </h3>
      </div>

      {/* Invite method */}
      <div
        role="tablist"
        aria-label="Invite method"
        className="mb-5 flex gap-6 border-b border-border"
      >
        <Button
          type="button"
          role="tab"
          aria-selected={method === "email"}
          variant="ghost"
          onClick={() => setMethod("email")}
          className="
            h-auto rounded-none border-b-2
            bg-transparent px-1 pb-3 pt-1
            text-sm font-medium
            hover:bg-transparent
            aria-selected:border-accent
            aria-selected:text-accent
            aria-[selected=false]:border-transparent
            aria-[selected=false]:text-muted-foreground
          "
        >
          <Mail className="size-4 mr-2" />
          <span>{t('Method.Email')}</span>
        </Button>

        <Button
          type="button"
          role="tab"
          aria-selected={method === "telephone"}
          variant="ghost"
          onClick={() => setMethod("telephone")}
          className="
            h-auto rounded-none border-b-2
            bg-transparent px-1 pb-3 pt-1
            text-sm font-medium
            hover:bg-transparent
            aria-selected:border-accent
            aria-selected:text-accent
            aria-[selected=false]:border-transparent
            aria-[selected=false]:text-muted-foreground
          "
        >
          <Phone className="size-4 mr-2" />
          <span>{t('Method.Tel')}</span>
        </Button>
      </div>

      {/* Invite form */}
      {method === "email" ? (
        <InputEmail
          value={email}
          role={role}
          roles={roles}
          onChange={setEmail}
          onRoleChange={setRole}
          onSubmit={handleSubmit}
        />
      ) : (
        <InputTelephone
          value={phone}
          country={country}
          role={role}
          roles={roles}
          countries={countries}
          onChange={setPhone}
          onCountryChange={setCountry}
          onRoleChange={setRole}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}