"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Theme } from "@radix-ui/themes" 
import { AppUsageProvider } from "@/components/contexts/AppUsageMode"
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query"

const queryClient = new QueryClient()

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
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Theme>
            <AppUsageProvider>
              {children}
            </AppUsageProvider>
          </Theme>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
    </> 
  )
}
