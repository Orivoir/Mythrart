import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import Providers from "./providers"
import "./globals.css"
import { UnloggedHeader } from "@/components/ui/header/unlogged-header"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
})


export const metadata: Metadata = {
  title: "Mythrart",
  description: "Document engine thinking with the art of Mythology",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <UnloggedHeader />
            <main>
              {children}
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
