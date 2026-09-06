export interface AvailableLanguage {
  locale: string
  label: string
  code: string
  countryCode: "FR" | "GB"
}

export interface LanguageMenuProps {
  trigger: React.ReactNode
  availableLanguages: AvailableLanguage[]
  currentLocale: string
  onLanguageChange?: (locale: string) => void
}