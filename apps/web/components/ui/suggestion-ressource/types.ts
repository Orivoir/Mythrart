export type SuggestionResource =
  | "authors"
  | "ebooks"
  | "chapters"
  | "recent-searches"
  | "assets"

export type Suggestion = {
  id: string
  resource: SuggestionResource
  label: string
  type: string
  href: string
}

export type SuggestionsList = {
  resource: SuggestionResource
  items: Suggestion[]
}

export type SuggestionsData = SuggestionsList[]
