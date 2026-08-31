"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Theme } from "@radix-ui/themes" 

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Theme>
          {children}
        </Theme>
      </ThemeProvider>
    </SessionProvider>
    </> 
  )
}
